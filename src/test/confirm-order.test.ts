import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'

const source = readFileSync('supabase/functions/confirm-order/index.ts', 'utf8')
  .replace(/^import .*;\r?\n/gm, '')
const order = {
  id: 'cs_test_paid', payment_status: 'paid', metadata: { app: 'vibe-code-workshop' },
  customer_details: { email: 'buyer@example.com', name: 'Buyer' }, amount_total: 29900, currency: 'chf',
}

async function confirm(options: { failure?: 'calendar' | 'buyer' | 'organizer' | 'database'; existing?: boolean; paid?: boolean } = {}) {
  const send = vi.fn().mockImplementation(async () => {
    if (options.failure === 'buyer' || options.failure === 'organizer') throw new Error(`${options.failure} email unavailable`)
    return []
  })
  const insert = vi.fn().mockResolvedValue({ error: options.failure === 'database' ? { code: 'db_error', message: 'unavailable' } : null })
  const signedUrl = vi.fn().mockResolvedValue(options.failure === 'calendar'
    ? { error: new Error('storage unavailable'), data: null }
    : { error: null, data: { signedUrl: 'https://example.com/calendar.ics' } })
  const client = {
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: options.existing ? { id: 'saved-order' } : null }) }) }), insert }),
    storage: { from: () => ({ createSignedUrl: signedUrl }) },
  }
  let handler: ((req: Request) => Promise<Response>) | undefined
  const transpiled = await import('typescript').then(ts => ts.transpile(source, { target: ts.ScriptTarget.ES2022 }))
  const run = new Function('createClient', 'sendTicketEmails', 'sendTemplateEmail', 'CALENDAR_BUCKET', 'CALENDAR_PATH', 'Deno', 'fetch', 'console', transpiled)
  run(() => client, send, vi.fn(), 'workshop-calendar', 'calendar.ics', {
    env: { get: () => 'configured' },
    serve: (fn: (req: Request) => Promise<Response>) => { handler = fn },
  }, async () => Response.json({ ...order, payment_status: options.paid === false ? 'unpaid' : 'paid' }), { log: vi.fn(), error: vi.fn() })
  if (!handler) throw new Error('Confirmation handler was not registered')
  const response = await handler(new Request('https://example.com/confirm-order', {
    method: 'POST', body: JSON.stringify({ session_id: order.id }),
  }))
  return { response, body: await response.json(), insert, send }
}

describe('paid order confirmation is independent of email delivery', () => {
  it.each(['calendar', 'buyer', 'organizer'] as const)('returns the saved paid order when %s delivery fails', async failure => {
    const { response, body, insert } = await confirm({ failure })
    expect(insert).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(200)
    expect(body).toMatchObject({ success: true, email_delivery: 'pending', order: { customer_email: 'buyer@example.com', amount_total: 29900 } })
  })
  it('keeps an existing paid order confirmed on reload while retrying delivery', async () => {
    const { response, body, insert, send } = await confirm({ existing: true, failure: 'organizer' })
    expect(insert).not.toHaveBeenCalled()
    expect(send).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
  })
  it('still rejects unpaid checkout sessions without saving or sending', async () => {
    const { response, insert, send } = await confirm({ paid: false })
    expect(response.status).toBe(400)
    expect(insert).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })
  it('still rejects orders that could not be saved', async () => {
    const { response, send } = await confirm({ failure: 'database' })
    expect(response.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })
  it('reports successful delivery with a confirmed order', async () => {
    const { response, body } = await confirm()
    expect(response.status).toBe(200)
    expect(body.email_delivery).toBe('sent')
  })
})
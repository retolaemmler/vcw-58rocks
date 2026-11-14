import { describe, it, expect, vi } from 'vitest'
import { dispatchTicketEmails } from '../../supabase/functions/_shared/ticket-email-dispatch'

const order = { sessionId: 'cs_test_order_1', email: 'buyer@example.com', name: 'Buyer', amount: '299.00', edition: '2027-01-27', calendarUrl: 'https://example.com/calendar.ics' }
describe('ticket email delivery', () => {
  it('sends the confirmation to the purchaser only', async () => {
    const send = vi.fn().mockResolvedValue({ sent: true })
    await dispatchTicketEmails(order, send)
    expect(send.mock.calls[0].slice(0, 2)).toEqual(['ticket-confirmation', 'buyer@example.com'])
  })
  it('notifies Reto and Remy, not Valentin', async () => {
    const send = vi.fn().mockResolvedValue({ sent: true })
    await dispatchTicketEmails(order, send)
    expect(send.mock.calls.slice(1).map(call => call[1])).toEqual(['rlaemmler@gmail.com', 'remy.blaettler@gmail.com'])
  })
  it('reuses event-derived keys across retries without conflating recipients', async () => {
    const send = vi.fn().mockResolvedValue({ sent: true })
    await dispatchTicketEmails(order, send)
    await dispatchTicketEmails(order, send)
    const keys = send.mock.calls.map(call => call[2].idempotencyKey)
    expect(new Set(keys.slice(0, 3)).size).toBe(3)
    expect(keys.slice(3)).toEqual(keys.slice(0, 3))
  })
  it('does not retry a suppressed recipient', async () => {
    const send = vi.fn().mockResolvedValue({ sent: false, reason: 'recipient_suppressed' })
    await dispatchTicketEmails(order, send)
    expect(send).toHaveBeenCalledTimes(3)
  })
  it('surfaces send failures after attempting independent organizer notices', async () => {
    const send = vi.fn().mockRejectedValueOnce(new Error('domain_not_verified')).mockResolvedValue({ sent: true })
    await expect(dispatchTicketEmails(order, send)).rejects.toThrow('domain_not_verified')
    expect(send).toHaveBeenCalledTimes(3)
  })
})
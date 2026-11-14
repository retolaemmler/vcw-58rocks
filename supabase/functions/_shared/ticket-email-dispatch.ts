export interface TicketEmailData {
  sessionId: string; email: string; name: string; company?: string; amount: string; edition: string; calendarUrl: string
}
type Sender = (template: string, recipient: string, options: { templateData: Record<string, unknown>; idempotencyKey: string }) => Promise<{ sent: boolean; reason?: string }>
export async function dispatchTicketEmails(data: TicketEmailData, send: Sender) {
  const templateData = { name: data.name, email: data.email, company: data.company, amount: data.amount, edition: data.edition, calendarUrl: data.calendarUrl }
  // Each fixed-recipient notice is its own template/send, never a recipient list.
  const results = await Promise.allSettled([
    send('ticket-confirmation', data.email, { templateData, idempotencyKey: `ticket-confirmation-${data.sessionId}` }),
    send('ticket-notification-reto', 'rlaemmler@gmail.com', { templateData, idempotencyKey: `ticket-notification-reto-${data.sessionId}` }),
    send('ticket-notification-remy', 'remy.blaettler@gmail.com', { templateData, idempotencyKey: `ticket-notification-remy-${data.sessionId}` }),
  ])
  const failure = results.find((result) => result.status === 'rejected')
  if (failure?.status === 'rejected') throw failure.reason
  return results
}
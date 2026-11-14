import { sendTemplateEmail } from './transactional-email-templates/send-email.ts'
import { dispatchTicketEmails, type TicketEmailData } from './ticket-email-dispatch.ts'

export const CALENDAR_BUCKET = 'workshop-calendar'
export const CALENDAR_PATH = 'vibe-code-workshop-2027-01-27.ics'
export function sendTicketEmails(data: TicketEmailData) {
  return dispatchTicketEmails(data, sendTemplateEmail)
}
import * as React from 'npm:react@18.3.1'
import { Html, Head, Preview, Body, Container, Section, Heading, Text, Button } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props { name?: string; amount?: string; calendarUrl?: string; isTest?: boolean }
const colors = { white: '#ffffff', teal: 'hsl(174, 72%, 40%)', muted: 'hsl(210, 20%, 97%)', ink: 'hsl(220, 20%, 10%)' }
const Email = ({ name = 'there', amount = '0.00', calendarUrl, isTest = false }: Props) => (
  <Html><Head /><Preview>Your Vibe Code Workshop ticket — 27 January 2027</Preview>
    <Body style={{ backgroundColor: colors.white, fontFamily: 'Inter, Arial, sans-serif', color: colors.ink }}>
      <Container style={{ maxWidth: '600px', padding: '24px' }}>
        <Section style={{ backgroundColor: colors.teal, padding: '30px', borderRadius: '8px', color: colors.white }}>
          <Heading>Vibe Code Workshop</Heading><Text>Build a Real Web App in One Evening</Text>
        </Section>
        {isTest && <Text>This is a test confirmation. No purchase has been made.</Text>}
        <Text>Dear {name} 👋</Text>
        <Text>Thank you for securing your spot! Your ticket for the Vibe Code Workshop has been confirmed.</Text>
        <Section style={{ backgroundColor: colors.muted, padding: '20px', borderRadius: '8px' }}>
          <Heading as="h2">Event Details</Heading>
          <Text>📅 Wednesday, 27 January 2027 · 17:00 – 21:00</Text>
          <Text>📍 Zürich – TBD</Text>
          <Text>🍕 Pizza and beverages included · unlimited Lovable credits for the evening</Text>
          <Text>💰 CHF {amount} {isTest ? '(example amount)' : 'paid'}</Text>
        </Section>
        {calendarUrl && <Button href={calendarUrl} style={{ backgroundColor: colors.teal, color: colors.white, padding: '12px 20px', borderRadius: '6px', marginTop: '20px' }}>Add to calendar</Button>}
        <Text>We'll send you more details as the event gets closer. See you there! 🚀</Text>
        <Text>Vibe Code Workshop · Zurich, Switzerland</Text>
      </Container>
    </Body>
  </Html>
)
export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) => `${data.isTest ? '[TEST] ' : ''}🎉 Your Vibe Code Workshop Ticket is Reserved!`,
  displayName: 'Ticket purchase confirmation',
  previewData: { name: 'Reto', amount: '299.00' },
} satisfies TemplateEntry
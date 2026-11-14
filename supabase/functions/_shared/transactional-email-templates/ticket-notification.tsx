import * as React from 'npm:react@18.3.1'
import { Html, Head, Preview, Body, Container, Heading, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props { name?: string; email?: string; company?: string; amount?: string; edition?: string }
const Email = ({ name = 'N/A', email = 'N/A', company = 'N/A', amount = '0.00', edition = '2027-01-27' }: Props) => (
  <Html><Head /><Preview>A new workshop ticket has been purchased</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', color: 'hsl(220, 20%, 10%)' }}>
      <Container style={{ padding: '30px', maxWidth: '600px' }}>
        <Heading style={{ color: 'hsl(174, 72%, 40%)' }}>🎟️ New Ticket Sold!</Heading>
        <Text>Name: {name}</Text><Text>Email: {email}</Text><Text>Company: {company}</Text>
        <Text>Amount: CHF {amount}</Text><Text>Edition: {edition}</Text>
        <Text>Vibe Code Workshop</Text>
      </Container>
    </Body>
  </Html>
)
const entry = { component: Email, subject: '🎟️ New Ticket Sold', previewData: { name: 'Example Buyer', email: 'buyer@example.com', amount: '299.00', edition: '2027-01-27' } }
export const retoTemplate = { ...entry, displayName: 'Ticket notification — Reto', to: 'rlaemmler@gmail.com' } satisfies TemplateEntry
export const remyTemplate = { ...entry, displayName: 'Ticket notification — Remy', to: 'remy.blaettler@gmail.com' } satisfies TemplateEntry
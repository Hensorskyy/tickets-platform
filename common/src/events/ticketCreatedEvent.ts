import { Subjects } from './subjects';

export interface TicketData {
  id: string
  title: string
  price: number
  userId: string
  version: number
}

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated
  data: TicketData
}

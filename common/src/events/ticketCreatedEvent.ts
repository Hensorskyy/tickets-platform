import { Subjects } from './subjects';

export interface TicketData {
  id: string
  title: string
  price: number
  userId: string
}

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated
  data: TicketData
}

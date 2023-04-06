import { Subjects } from './subjects';
import { TicketData } from '..';

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated
  data: TicketData
}

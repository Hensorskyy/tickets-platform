import { Subjects } from "./types/subjects";
import { TicketData } from "..";

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: TicketData;
}

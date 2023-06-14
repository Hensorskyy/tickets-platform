import { Publisher, Subjects, TicketCreatedEvent } from "@vhticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}

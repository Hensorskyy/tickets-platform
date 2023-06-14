import { Publisher, Subjects, TicketUpdatedEvent } from "@vhticketing/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

import { OrderCreatedEvent, Publisher, Subjects } from "@vhticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

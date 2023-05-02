import { OrderCancelledEvent, Publisher, Subjects } from "@vhticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  readonly subject = Subjects.OrderCancelled;
}
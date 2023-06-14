import { OrderData } from "./orderCreatedEvent";
import { Subjects } from "./types/subjects";

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: OrderData;
}

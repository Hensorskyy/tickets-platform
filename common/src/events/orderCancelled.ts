import { OrderData } from './orderCreated';
import { Subjects } from './subjects';

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled
  data: OrderData
}

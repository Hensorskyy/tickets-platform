import { OrderStatus } from '..';
import { Subjects } from './subjects';

export interface OrderData {
  id: string
  status: OrderStatus
  expiresAt: string
  userId: string
  version: number
  ticket: {
    id: string
    price: number
  }
}

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated
  data: OrderData
}



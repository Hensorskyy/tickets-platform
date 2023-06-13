import { ExpirationCompletedEvent, ExpirationData, Listener, OrderStatus, Subjects } from "@vhticketing/common";

import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/orderCancelledPublisher";
import { queueGroupName } from "./constants";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent>{
  readonly subject = Subjects.ExpirationCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationData, msg: Message): Promise<void> {
    const { orderId } = data
    const order = await Order.findById(orderId).populate('ticket')

    if (!order) {
      throw new Error(`The order ${orderId} is not found`);
    }

    order.set({ status: OrderStatus.Canceled });
    await order.save()

    new OrderCancelledPublisher(this.client).publish(
      {
        id: order.id,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        userId: order.userId,
        version: order.version,
        ticket: {
          id: order.ticket.id,
          price: order.ticket.price
        }
      }
    )

  }

}
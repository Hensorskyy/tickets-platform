import {
  Listener,
  OrderCreatedEvent,
  OrderData,
  Subjects,
} from "@vhticketing/common";

import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./constants";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderData, msg: Message): Promise<void> {
    const order = Order.build({
      ...data,
      price: data.ticket.price,
    });

    await order.save();

    msg.ack();
  }
}

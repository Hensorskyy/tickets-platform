import { Listener, OrderCreatedEvent, OrderData, Subjects } from "@vhticketing/common";

import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroupName } from "./ constants";

export class OrderListener extends Listener<OrderCreatedEvent>{
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderData, msg: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay} milisecond before publishing the event`)
    await expirationQueue.add({ orderId: data.id }, { delay })

    msg.ack()
  }

}
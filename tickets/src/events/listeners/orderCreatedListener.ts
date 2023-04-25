import { Listener, OrderCreatedEvent, OrderData, Subjects, TicketData } from "@vhticketing/common";

import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticketUpdatedPublisher";
import { queueGroupName } from "./constants";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderData, msg: Message): Promise<void> {

    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket has not been found');
    }

    ticket.set({ orderId: data.id })
    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish(ticket as TicketData)

    msg.ack()
  }

}
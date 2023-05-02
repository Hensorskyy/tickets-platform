import { Listener, Subjects, TicketCreatedEvent, TicketData } from "@vhticketing/common";

import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./constants";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = queueGroupName

  async onMessage(ticketData: TicketData, msg: Message): Promise<void> {
    const { id, price, title } = ticketData
    const ticket = Ticket.build({ id, price, title })
    await ticket.save()

    msg.ack()
  }

}
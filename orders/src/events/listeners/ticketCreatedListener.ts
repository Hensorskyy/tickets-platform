import { Listener, Subjects, TicketCreatedEvent, TicketData } from "@vhticketing/common";

import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./constants";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = queueGroupName

  async onMessage(ticketData: TicketData, msg: Message): Promise<void> {
    const ticket = Ticket.build(ticketData)
    await ticket.save()

    msg.ack()
  }

}
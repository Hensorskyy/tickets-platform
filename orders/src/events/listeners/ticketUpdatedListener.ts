import { Listener, NotFoundError, Subjects, TicketData, TicketUpdatedEvent } from "@vhticketing/common";

import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./constants";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(ticketData: TicketData, msg: Message): Promise<void> {

    const ticket = await Ticket.findOne({
      _id: ticketData.id,
      version: ticketData.version - 1
    })

    if (!ticket) {
      throw new NotFoundError('There is not such ticket')
    }

    const { title, price } = ticketData
    ticket.set({ title, price })
    await ticket.save()

    msg.ack()
  }

}
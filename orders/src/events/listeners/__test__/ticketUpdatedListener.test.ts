import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { TicketCreatedListener } from "../ticketCreatedListener"
import { TicketData } from "@vhticketing/common"
import { TicketUpdatedListener } from "../ticketUpdatedListener"
import mongoose from "mongoose"
import { natsWrapper } from "../../../natsWrapper"

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticketId = new mongoose.Types.ObjectId().toHexString()

  const ticket = Ticket.build({
    id: ticketId,
    title: 'football',
    price: 100
  })

  await ticket.save()

  const data: TicketData = {
    id: ticketId,
    title: 'Test Football',
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('updates ticket', async () => {
  const { listener, data, msg, ticket } = await setup()
  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket).toBeDefined()
  expect(updatedTicket?.price).toBe(data.price)
  expect(updatedTicket?.title).toBe(data.title)
  expect(updatedTicket?.version).toBe(data.version)
})

it('acknowledges event', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toBeCalled()
})
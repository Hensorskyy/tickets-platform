import { OrderData, OrderStatus } from "@vhticketing/common"

import { Message } from "node-nats-streaming"
import { OrderCreatedListener } from "../orderCreatedListener"
import { Ticket } from "../../../models/ticket"
import mongoose from "mongoose"
import { natsWrapper } from "../../../natsWrapper"

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    title: 'Football',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString()
  })

  await ticket.save()

  const data: OrderData = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: '2023.05.10',
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('sets order id', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(data.ticket.id)

  expect(updatedTicket?.orderId).toBe(data.id)
})

it('acknowledges event', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('publishes event', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const mockFunc = natsWrapper.client.publish as jest.Mock
  const params = JSON.parse(mockFunc.mock.calls[0][1])

  expect(natsWrapper.client.publish).toHaveBeenCalled()
  expect(params.price).toBe(data.ticket.price)
  expect(params.id).toBe(data.ticket.id)
})
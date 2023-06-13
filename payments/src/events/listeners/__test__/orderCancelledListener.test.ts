import { OrderData, OrderStatus } from "@vhticketing/common"

import { Order } from "../../../models/order"
import { OrderCancelledListener } from "../orderCancelledListener"
import mongoose from "mongoose"
import { natsWrapper } from "../../../natsWrapper"

const setup = async() => {
    const data: OrderData = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: 'testUser',
        expiresAt: new Date().toDateString(),
        version: 0,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 20
        }
    }

    const order = Order.build({
        ...data, 
        price: data.ticket.price 
     })

    await order.save()

    const listener = new OrderCancelledListener(natsWrapper.client)

      //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    data.version = 1
    return { data, listener, msg }
}

it('updates the status of order', async() => {
    const {data, listener, msg } = await setup()
    await listener.onMessage(data, msg)

    const order = await Order.findById(data.id)

    expect(order?.status).toEqual(OrderStatus.Canceled)
})

it('ack a message', async() => {
    const {data, listener, msg } = await setup()
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})
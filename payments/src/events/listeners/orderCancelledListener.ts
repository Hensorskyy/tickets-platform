import { Listener, OrderCancelledEvent, OrderData, OrderStatus, Subjects } from "@vhticketing/common";

import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./constants";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderData, msg: Message): Promise<void> {

        const order = await Order.findOne({_id: data.id, version: data.version - 1})
        if(!order){
            throw new Error('Order has not been found')
        }

        order.set({status: OrderStatus.Canceled})
        await order.save()

        msg.ack()
    }
}
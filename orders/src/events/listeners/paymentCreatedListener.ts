import { Listener, OrderStatus, PaymentCreatedEvent, PaymentData, Subjects } from "@vhticketing/common";

import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./constants";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

   async onMessage(data: PaymentData, msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId)
        
        if(!order){
            throw new Error('Order is not found')
        }

        order.set({status: OrderStatus.Compelete})
        await order.save()

        msg.ack()
    }

}
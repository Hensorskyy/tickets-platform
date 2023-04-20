import mongoose, { Document, Model, Schema } from "mongoose";

import { Order } from "./order";
import { OrderStatus } from "@vhticketing/common";

interface TicketAttrs {
  title: string,
  price: number,
}

export interface TicketDoc extends Document, TicketAttrs {
  isReserved: () => Promise<boolean>
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id,
        delete ret._id
    }
  }

})

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}

ticketSchema.methods.isReserved = async function () {
  const order = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Compelete
      ]
    }
  })
  return !!order
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket }

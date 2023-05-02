import mongoose, { Document, Model, Schema } from "mongoose";

import { Order } from "./order";
import { OrderStatus } from "@vhticketing/common";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
  title: string,
  price: number,
  id?: any,
}

interface EventData {
  id: string,
  version: number
}

export interface TicketDoc extends TicketAttrs, Document {
  isReserved: () => Promise<boolean>
  version: number
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByEvent(event: EventData): Promise<TicketDoc | null>
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

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const _id = attrs?.id
  delete attrs.id
  return new Ticket({ _id, ...attrs })
}

ticketSchema.statics.findByEvent = ({ id, version }: EventData) => {
  return Ticket.findOne({
    _id: id,
    version: version - 1
  })
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

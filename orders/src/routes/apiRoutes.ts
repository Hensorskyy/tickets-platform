import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requestValidate, userAuthorize } from "@vhticketing/common";
import express, { Request, Response } from "express";

import { Order } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/orderCancelledPublisher";
import { OrderCreatedPublisher } from "../events/publishers/orderCreatedPublisher";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import mongoose from "mongoose";
import { natsWrapper } from "../natsWrapper";

const EXPIRATION_SECONDS = 15 * 60

const apiRouter = express.Router()

apiRouter.get('/orders', userAuthorize, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req?.currentUser?.id }).populate('ticket')
  res.send(orders)
})

apiRouter.post('/orders', userAuthorize, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
], requestValidate, async (req: Request, res: Response) => {
  const { ticketId } = req.body

  const ticket = await Ticket.findById(ticketId)
  if (!ticket) {
    throw new NotFoundError('The ticket does not exist')
  }

  const isReserved = await ticket.isReserved()
  if (isReserved) {
    throw new BadRequestError('The ticket is not available for purсhase')
  }

  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS)

  const order = Order.build({
    userId: req?.currentUser?.id as string,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket: ticket
  })

  await order.save()

  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: OrderStatus.Created,
    expiresAt: order.expiresAt.toISOString(),
    userId: order.userId,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    }
  })

  res.status(201).send(order)
})


apiRouter.get('/orders/:id', userAuthorize, async (req: Request, res: Response) => {
  const orderId = req.params?.id
  const order = await Order.findById(orderId).populate('ticket')

  if (!order) {
    throw new NotFoundError('The order has not been found')
  }
  if (order.userId !== req.currentUser?.id) {
    throw new NotAuthorizedError()
  }

  res.send(order)
})


apiRouter.patch('/orders/:id', userAuthorize, async (req: Request, res: Response) => {
  const orderId = req.params?.id
  const order = await Order.findById(orderId).populate('ticket')

  if (!order) {
    throw new NotFoundError('The order has not been found')
  }
  if (order.userId !== req.currentUser?.id) {
    throw new NotAuthorizedError()
  }

  order.status = OrderStatus.Canceled
  await order.save()

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    status: OrderStatus.Created,
    expiresAt: order.expiresAt.toISOString(),
    userId: order.userId,
    ticket: {
      id: order.ticket.id,
      price: order.ticket.price,
    }
  })

  res.send(order)
})

export default apiRouter
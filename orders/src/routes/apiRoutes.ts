import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requestValidate, userAuthorize } from "@vhticketing/common";
import express, { Request, Response } from "express";

import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { body } from "express-validator";
import mongoose from "mongoose";
import { natsWrapper } from "../natsWrapper";

const EXPIRATION_SECONDS = 15 * 60

const apiRouter = express.Router()

apiRouter.get('/orders', async (req: Request, res: Response) => {
  res.status(201).send()
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

  res.status(201).send(order)
})


apiRouter.get('/orders/:id', async (req: Request, res: Response) => {
  const ordersId = req.params?.id
  res.send(ordersId)
})


apiRouter.delete('/orders/:id', async (req: Request, res: Response) => {
  const ordersId = req.params?.id
  res.send('')
})

export default apiRouter
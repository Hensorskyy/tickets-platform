import { NotFoundError, requestValidate, userAuthorize } from "@vhticketing/common";
import express, { Request, Response } from "express";

import { Ticket } from "../models/ticket";
import { body } from "express-validator";

const apiRouter = express.Router()

apiRouter.post('/tickets', userAuthorize, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Must be greater than 0')
], requestValidate, async (req: Request, res: Response) => {

  const { title, price } = req.body

  const ticket = Ticket.build({ title, price, userId: req.currentUser!.id })
  const ticketResponse = await ticket.save()

  res.status(201).send(ticketResponse)
})


apiRouter.get('/tickets/:id', async (req: Request, res: Response) => {
  const ticketId = req.params?.id

  const ticket = await Ticket.findById(ticketId)

  if (!ticket) {
    throw new NotFoundError('Ticket was not found')
  }

  res.send(ticket)
})

export default apiRouter
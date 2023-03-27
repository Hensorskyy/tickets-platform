import { NotFoundError, requestValidator, userAuthorizator } from "@vhticketing/common";
import express, { Request, Response } from "express";

import { Ticket } from "../models/ticket";
import { body } from "express-validator";

const apiRouter = express.Router()

apiRouter.post('/tickets', userAuthorizator, [
  body('title')
    .not()
    .isEmpty()
    .withMessage('title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Must be greater than 0')
], requestValidator, async (req: Request, res: Response) => {

  const { title, price } = req.body

  const ticket = Ticket.build({ title, price, userId: req.currentUser!.id })
  await ticket.save()

  res.sendStatus(201)
})


apiRouter.get('/tickets/:id', async (req: Request, res: Response) => {
  const id = req.params.id
  const ticket = await Ticket.findById(id)

  if (!ticket) {
    throw new NotFoundError('Ticket was not found')
  }

  res.send(ticket)
})

export default apiRouter
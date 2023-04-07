import { NotAuthorizedError, NotFoundError, TicketData, requestValidate, userAuthorize, userSet } from "@vhticketing/common";
import express, { Request, Response } from "express";

import { body } from "express-validator";
import { natsWrapper } from "../natsWrapper";

const apiRouter = express.Router()

apiRouter.get('/orders', async (req: Request, res: Response) => {
  res.status(201).send()
})

apiRouter.post('/orders', async (req: Request, res: Response) => {
  res.status(201).send()
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
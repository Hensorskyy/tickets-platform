import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requestValidate, userAuthorize } from "@vhticketing/common";
import { Request, Response, Router } from "express";

import { Order } from "../models/order";
import { body } from "express-validator";

const chargeRouter = Router()

chargeRouter.post('/api/payments', 
    userAuthorize, 
    [body('token').notEmpty(), body('orderId').notEmpty()], 
    requestValidate, 
    async(req: Request, res: Response) => {
        const {token, orderId} = req.body

        const order = await Order.findById(orderId)

        if(!order){
            throw new NotFoundError()
        }
        if(order.userId !== req.currentUser?.id) {
            throw new NotAuthorizedError()
        }
        if(order.status === OrderStatus.Canceled) {
            throw new BadRequestError('Can not pay for cancelled order')
        }

        res.send({succes: true})
})

export {chargeRouter}
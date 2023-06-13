import { Order } from '../../models/order'
import { OrderStatus } from '@vhticketing/common'
import { app } from '../../app'
import mongoose from 'mongoose'
import request from 'supertest'

it('return 404 if an order is not found', async() => {
   await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
        token: 'token',
        orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
})

it('return 401 if user does not match', async() => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(), 
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 10,
        status: OrderStatus.Created 
    })

    await order.save()

    await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
        token: 'token',
        orderId: order.id
    })
    .expect(401)
    
})

it('return 400 if purchase cancelled order', async() => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(), 
        version: 0,
        userId,
        price: 10,
        status: OrderStatus.Canceled 
    })

    await order.save()

    await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
        token: 'token',
        orderId: order.id
    })
    .expect(400)
})
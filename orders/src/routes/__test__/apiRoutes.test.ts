import { Order } from '../../models/order'
import { OrderStatus } from '@vhticketing/common'
import { Ticket } from '../../models/ticket'
import { app } from '../../app'
import mongoose from 'mongoose'
import request from 'supertest'

it('return an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId()
  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({
      ticketId
    })
    .expect(404)
})

it('return an error if the ticket is already reserved', async () => {

  const ticket = Ticket.build({ title: 'footbal', price: 50 })
  await ticket.save()

  const order = Order.build({ userId: 'id', status: OrderStatus.Created, expiresAt: new Date(), ticket })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket?.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({ title: 'footbal', price: 50 })
  await ticket.save()

  request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket?.id })
    .expect(201)
})
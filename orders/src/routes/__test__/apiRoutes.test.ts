import { Order } from '../../models/order'
import { OrderStatus } from '@vhticketing/common'
import { Ticket } from '../../models/ticket'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../natsWrapper'
import request from 'supertest'

const buildTicket = async () => {
  const ticket = Ticket.build({ title: 'footbal', price: 50 })
  await ticket.save()
  return ticket
}

describe('checks if user is able to create an order', () => {
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

    const ticket = await buildTicket()

    const order = Order.build({ userId: 'id', status: OrderStatus.Created, expiresAt: new Date(), ticket })
    await order.save()

    await request(app)
      .post('/api/orders')
      .set('Cookie', signin())
      .send({ ticketId: ticket?.id })
      .expect(400)
  })

  it('reserves a ticket', async () => {
    const ticket = await buildTicket()

    await request(app)
      .post('/api/orders')
      .set('Cookie', signin())
      .send({ ticketId: ticket?.id })
      .expect(201)
  })

  it('publishes an event once a ticket is created', async () => {
    const ticket = await buildTicket()

    await request(app)
      .post('/api/orders')
      .set('Cookie', signin())
      .send({ ticketId: ticket?.id })
      .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })

})

describe('user can retrieve the orders', () => {
  it('get orders for a specific user', async () => {
    const ticketOne = await buildTicket()
    const ticketTwo = await buildTicket()
    const ticketThree = await buildTicket()

    const userOne = signin()
    const userTwo = signin()

    request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({ ticketId: ticketOne?.id })
      .expect(201)


    const { body: orderOne } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketTwo?.id })
      .expect(201)
    const { body: orderTwo } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticketThree?.id })
      .expect(201)

    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', userTwo)
      .expect(200)

    expect(response.body.length).toEqual(2)
    expect(response.body[0].id).toEqual(orderOne.id)
    expect(response.body[1].id).toEqual(orderTwo.id)
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
    expect(response.body[1].ticket.id).toEqual(ticketThree.id)
  })

  it('get order by order id', async () => {
    const ticket = await buildTicket()

    const user = signin()

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket?.id })
      .expect(201)

    const reponse = await request(app)
      .get(`/api/orders/${order?.id}`)
      .set('Cookie', user)
      .send()
      .expect(200)

    expect(reponse.body.id).toEqual(order.id)
    expect(reponse.body.ticket.id).toEqual(ticket.id)
  })

  it('can not get order by order id if user is not an owner ', async () => {
    const ticket = await buildTicket()

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', signin())
      .send({ ticketId: ticket?.id })
      .expect(201)

    await request(app)
      .get(`/api/orders/${order?.id}`)
      .set('Cookie', signin())
      .send()
      .expect(401)
  })
})

describe('user can cancel an order', () => {
  it('order canleling changes order status', async () => {
    const ticket = await buildTicket()

    const user = signin()

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket?.id })
      .expect(201)

    await request(app)
      .patch(`/api/orders/${order?.id}`)
      .set('Cookie', user)
      .send()
      .expect(200)

    const { body: canceledOrder } = await request(app)
      .get(`/api/orders/${order?.id}`)
      .set('Cookie', user)
      .send()
      .expect(200)

    expect(order.id).toEqual(canceledOrder.id)
    expect(canceledOrder.status).toEqual(OrderStatus.Canceled)
  })

  it('publishes an event when order is canceled', async () => {
    const ticket = await buildTicket()

    const user = signin()

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', user)
      .send({ ticketId: ticket?.id })
      .expect(201)

    await request(app)
      .patch(`/api/orders/${order?.id}`)
      .set('Cookie', user)
      .send()
      .expect(200)

    const { body: canceledOrder } = await request(app)
      .get(`/api/orders/${order?.id}`)
      .set('Cookie', user)
      .send()
      .expect(200)

    expect(order.id).toEqual(canceledOrder.id)
    expect(canceledOrder.status).toEqual(OrderStatus.Canceled)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
  })
})
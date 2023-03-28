import { app } from '../../app'
import mongoose from 'mongoose'
import request from 'supertest'

const ticketStub = { title: 'title', price: 10 }

describe('update ticket route', () => {
  it('returns 404 if no ticket found', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set('Cookie', signin())
      .send(ticketStub)
      .expect(404)
  })

  it('returns 401 if user is not authorized', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send(ticketStub)

    expect(response.statusCode).toEqual(201)

    await request(app)
      .put(`/api/tickets/${response?.body?.id}`)
      .send(ticketStub)
      .expect(401)
  })

  it('returns 401 if user is not owner of a ticket', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send(ticketStub)

    expect(response.statusCode).toEqual(201)

    await request(app)
      .put(`/api/tickets/${response?.body?.id}`)
      .set('Cookie', signin())
      .send(ticketStub)
      .expect(401)
  })

  it('returns 400 if either price or title is incorrect', async () => {
    const cookie = signin()

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send(ticketStub)

    expect(response.statusCode).toEqual(201)

    await request(app)
      .put(`/api/tickets/${response?.body?.id}`)
      .set('Cookie', cookie)
      .send({ title: '', price: 10 })
      .expect(400)

    await request(app)
      .put(`/api/tickets/${response?.body?.id}`)
      .set('Cookie', cookie)
      .send({ title: 'test', price: -10 })
      .expect(400)
  })

  it('returns 200 when ticket is succesfully updated', async () => {
    const cookie = signin()
    const newTicketData = { title: 'newTicket', price: 500 }

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send(ticketStub)

    expect(response.statusCode).toEqual(201)

    const ticketPriceResponse = await request(app)
      .put(`/api/tickets/${response?.body?.id}`)
      .set('Cookie', cookie)
      .send({ price: newTicketData.price })
      .expect(200)
    expect(ticketPriceResponse.body?.price).toEqual(newTicketData.price)

    const ticketTitleResponse = await request(app)
      .put(`/api/tickets/${response?.body?.id}`)
      .set('Cookie', cookie)
      .send({ title: newTicketData.title })
      .expect(200)
    expect(ticketTitleResponse.body?.title).toEqual(newTicketData.title)


    const ticketResponse = await request(app)
      .put(`/api/tickets/${response?.body?.id}`)
      .set('Cookie', cookie)
      .send(newTicketData)
      .expect(200)
    expect(ticketResponse.body?.title).toEqual(newTicketData.title)
    expect(ticketResponse.body?.price).toEqual(newTicketData.price)
  })
})


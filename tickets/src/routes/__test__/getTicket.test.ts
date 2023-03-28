import { app } from '../../app'
import mongoose from 'mongoose'
import request from 'supertest'

describe('get tickets route', () => {
  it('returns 404 if no ticket', async () => {
    const id = new mongoose.Types.ObjectId();

    await request(app)
      .get(`/api/tickets/${id}`)
      .send()
      .expect(404)
  })

  it('returns ticket if it exists', async () => {

    const ticket = {
      title: 'test',
      price: 10
    }

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send(ticket)
      .expect(201)

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body?.id}`)
      .send()
      .expect(200)

    expect(ticketResponse?.body.title).toEqual(ticket.title)
  })
})
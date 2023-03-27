import { Ticket } from '../../models/ticket'
import { app } from '../../app'
import request from 'supertest'

describe('creating new ticket route', () => {
  it('has a route handler for creating new tickets', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({})
    expect(response.status).not.toEqual(404)
  })

  it('can be accessible for only authenticated users', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({})
    expect(response.status).toEqual(401)
  })

  it('returns not 401 if user is signed in', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send({})
    expect(response.status).not.toEqual(401)
  })

  it('returns an error if title is incorrect', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send({ title: '', price: 10 })
      .expect(400)

    await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send({ price: 10 })
      .expect(400)
  })

  it('returns an error if price is incorrect', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send({ title: 'title', price: -10 })
      .expect(400)

    await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send({ title: 'title' })
      .expect(400)
  })

  it('creates ticket if inputs are valid', async () => {

    let tickets = await Ticket.find({})
    expect(tickets.length).toEqual(0)

    await request(app)
      .post('/api/tickets')
      .set('Cookie', signin())
      .send({ title: 'title', price: 10 })
      .expect(201)

    tickets = await Ticket.find({})
    expect(tickets.length).toEqual(1)
  })
})

describe('fetch tickets', () => {
  // it('returns 404 if no ticket', async () => {
  //   await request(app)
  //     .get('/api/ticket/test')
  //     .send()
  //     .expect(404)
  // })

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

    console.log(response?.body)

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body?.id}`)
      .send()
      .expect(200)

    expect(ticketResponse?.body.title).toEqual(ticket.title)
  })
})
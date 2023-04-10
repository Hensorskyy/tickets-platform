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

it('return an error if the ticket is already reserved', () => {

})

it('reserves a ticket', () => {

})
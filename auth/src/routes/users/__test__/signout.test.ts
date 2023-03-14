import { app } from "../../../app"
import request from "supertest";

const user = { email: 'test@test.com', password: 'password' }

describe('signout route tests', () => {
  it('clears the cookia after signinig out', async () => {

    const cookieValue = ['jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT']
    await request(app)
      .post('/api/users/signup')
      .send(user)
      .expect(201)

    const response = await request(app)
      .post('/api/users/signout')
      .send({})
      .expect(200)

    expect(response.get('Set-Cookie')).toEqual(cookieValue)
  })

})

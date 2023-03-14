import { app } from "../../../app"
import request from "supertest";

describe('singup route tests', () => {
  it('returs a 201 on succesful signup', async () => {
    return request(app).post('/api/users/signup').send({ email: 'test@test.com', password: 'password' }).expect(201)
  })
})

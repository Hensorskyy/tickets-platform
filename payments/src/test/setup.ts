import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { sign } from 'jsonwebtoken';

declare global {
  var signin: (id?: string) => string[];
}

let mongoDB: MongoMemoryServer

jest.mock('../natsWrapper')

process.env.STRIPE_KEY='sk_test_51NIYu1EZAOgdixSjlTaM9EePU3h4vaFDXJyAstJKKOfc1rcC0rG2Rnwntwpt9nIUeR61f7zQ1nuvSAUYrCKeyghP005eY3Xeoi'

beforeAll(async () => {
  process.env.JWT_KEY = 'test'
  mongoDB = await MongoMemoryServer.create();
  const mongoUrl = mongoDB.getUri();

  await mongoose.connect(mongoUrl)
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongoDB.stop();
  await mongoose.connection.close()
})


global.signin = (id?: string) => {
  const payload = { email: 'test@test.com', id: id || new mongoose.Types.ObjectId() }

  const jwtToken = sign(payload, process.env.JWT_KEY!)

  const session = { jwt: jwtToken }
  const base64 = Buffer.from(JSON.stringify(session)).toString('base64')

  return [`session=${base64}`]
}
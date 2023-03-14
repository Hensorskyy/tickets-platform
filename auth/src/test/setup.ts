import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from "../app";
import mongoose from 'mongoose';

let mongoDB: MongoMemoryServer

beforeAll(async () => {
  const mongoDB = await MongoMemoryServer.create();
  const mongoUrl = mongoDB.getUri();

  await mongoose.connect(mongoUrl)
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongoDB.stop();
  await mongoose.connection.close()
})

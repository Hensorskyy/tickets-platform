import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../app";
import mongoose from "mongoose";
import request from "supertest";

declare global {
  var signin: () => Promise<string[]>;
}

let mongoDB: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "test";
  mongoDB = await MongoMemoryServer.create();
  const mongoUrl = mongoDB.getUri();

  await mongoose.connect(mongoUrl);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoDB.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "passowrd";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};

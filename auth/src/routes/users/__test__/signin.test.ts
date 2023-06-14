import { app } from "../../../app";
import request from "supertest";

const user = { email: "test@test.com", password: "password" };

beforeEach(async () => {
  await request(app).post("/api/users/signup").send(user).expect(201);
});

describe("signin route tests", () => {
  it("returs a 200 on succesful signup", async () => {
    await request(app).post("/api/users/signin").send(user).expect(200);
  });

  it("returs a 400 with incorrect email", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({ ...user, email: "test1@test.com" })
      .expect(400);
  });

  it("returs a 400 with incorrect password", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({ ...user, password: "test" })
      .expect(400);
  });

  it("returs a 400 with incorrect password", async () => {
    const response = await request(app)
      .post("/api/users/signin")
      .send(user)
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

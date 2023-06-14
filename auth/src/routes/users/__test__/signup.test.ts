import { app } from "../../../app";
import request from "supertest";

describe("signup route tests", () => {
  it("returs a 201 on succesful signup", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(201);
  });

  it("returs a 400 with an invalid email", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({ email: "testcom", password: "password" })
      .expect(400);
  });

  it("returs a 400 with an invalid password", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "p" })
      .expect(400);
  });

  it("returs a 400 with missing email and passsword", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com" })
      .expect(400);

    await request(app)
      .post("/api/users/signup")
      .send({ password: "password" })
      .expect(400);
  });

  it("disallows duplicate emails", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(201);

    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(400);
  });

  it("sets a cookie after succesful signup", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

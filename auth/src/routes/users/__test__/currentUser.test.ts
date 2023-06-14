import { app } from "../../../app";
import request from "supertest";

const user = { email: "test@test.com", password: "password" };

describe("current user route tests", () => {
  it("respons with details about the current user", async () => {
    const cookie = await global.signin();
    const response = await request(app)
      .get("/api/users/currentUser")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual(user.email);
  });

  it("respons with 401 if not authenticated", async () => {
    const response = await request(app)
      .get("/api/users/currentUser")
      .send()
      .expect(200);

    expect(response.body.currentUser).toEqual(null);
  });
});

import { Ticket } from "../../models/ticket";
import { app } from "../../app";
import { natsWrapper } from "../../natsWrapper";
import request from "supertest";

describe("creating new ticket route", () => {
  it("has a route handler for creating new tickets", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).not.toEqual(404);
  });

  it("can be accessible for only authenticated users", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).toEqual(401);
  });

  it("returns not 401 if user is signed in", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({});
    expect(response.status).not.toEqual(401);
  });

  it("returns an error if title is incorrect", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({ title: "", price: 10 })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({ price: 10 })
      .expect(400);
  });

  it("returns an error if price is incorrect", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({ title: "title", price: -10 })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({ title: "title" })
      .expect(400);
  });

  it("creates ticket if inputs are valid", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({ title: "title", price: 10 })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
  });

  it("publishes a new event", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", signin())
      .send({ title: "title", price: 10 })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});

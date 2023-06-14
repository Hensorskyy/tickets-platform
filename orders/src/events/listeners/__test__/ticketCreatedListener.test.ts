import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { TicketCreatedListener } from "../ticketCreatedListener";
import { TicketData } from "@vhticketing/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../../natsWrapper";

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketData = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Football",
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates ticket", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.price).toBe(data.price);
  expect(ticket?.title).toBe(data.title);
});

it("acknowledges event", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});

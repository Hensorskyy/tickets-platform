import { OrderData, OrderStatus } from "@vhticketing/common";

import { Order } from "../../../models/order";
import { OrderCreatedListener } from "../orderCreatedListener";
import mongoose from "mongoose";
import { natsWrapper } from "../../../natsWrapper";

const setup = () => {
  const data: OrderData = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "testUser",
    expiresAt: new Date().toDateString(),
    version: 0,
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
    },
  };

  const listener = new OrderCreatedListener(natsWrapper.client);

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { data, listener, msg };
};

it("creates an order", async () => {
  const { data, listener, msg } = setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order?.price).toEqual(data.ticket.price);
});

it("ack a message", async () => {
  const { data, listener, msg } = setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

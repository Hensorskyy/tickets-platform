import { OrderCancelledListener } from "./events/listeners/orderCancelledListener";
import { OrderCreatedListener } from "./events/listeners/orderCreatedListener";
import { app } from "./app";
import mongoose from "mongoose";
import { natsWrapper } from "./natsWrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT key is required");
  }
  if (!process.env.DB_URI) {
    throw new Error("DB URI must be specified");
  }

  if (!process.env.NATS_URI) {
    throw new Error("NATS URI must be specified");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS CLUSTER ID must be specified");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS CLIENT ID must be specified");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS closing connection!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error("Could not connect to NATS server", err);
  }

  try {
    const dbName = "tickets";
    await mongoose.connect(`${process.env.DB_URI}/${dbName}`);
    console.log("Connected successfully to mongoDB");
  } catch (err) {
    console.error("Could not connect to a database", err);
  }

  app.listen(3000, () => {
    console.log("Listenning on port 3000!");
  });
};

start();

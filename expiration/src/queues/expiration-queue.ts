import { ExpirationCompletedPublisher } from "../events/publishers/expirationCompletedPublisher";
import Queue from "bull";
import { bullQueueName } from "../events/listeners/ constants";
import { natsWrapper } from "../natsWrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>(bullQueueName, {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process((job) => {
  new ExpirationCompletedPublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };

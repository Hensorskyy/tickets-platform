import { natsWrapper } from './natsWrapper';

const start = async () => {
  if (!process.env.NATS_URI) {
    throw new Error('NATS URI must be specified')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS CLUSTER ID must be specified')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS CLIENT ID must be specified')
  }
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URI)

    natsWrapper.client.on('close', () => {
      console.log('NATS closing connection!')
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
  }
  catch (err) {
    console.error('Could not connect to NATS server', err)
  }
}

start()


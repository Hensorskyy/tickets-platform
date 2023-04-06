import { app } from './app';
import mongoose from 'mongoose';
import { natsWrapper } from '../natsWrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT key is required')
  }

  if (!process.env.DB_URI) {
    throw new Error('DB URI must be specified')
  }

  try {
    const natsCluster = 'ticketing';
    await natsWrapper.connect(natsCluster, 'test', 'http://nats-srv:4222')
    console.log('Connected successfully to NATS server');
  }
  catch (err) {
    console.error('Could not connect to NATS server', err)
  }

  try {
    const dbName = 'tickets';
    await mongoose.connect(`${process.env.DB_URI}/${dbName}`)
    console.log('Connected successfully to mongoDB');
  }
  catch (err) {
    console.error('Could not connect to a database', err)
  }

  app.listen(3000, () => {
    console.log('Listenning on port 3000!')
  })
}

start()


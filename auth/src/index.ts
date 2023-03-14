import { app } from './app';
import mongoose from 'mongoose';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT key is required')
  }

  try {
    const dbUrl = 'mongodb://auth-mongo-srv:27017';
    const dbName = 'auth';

    await mongoose.connect(`${dbUrl}/${dbName}`)
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


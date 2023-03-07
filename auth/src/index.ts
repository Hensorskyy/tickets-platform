import { errorHandler } from './middlewares/errorHandler'
import express from 'express'
import mongoose from 'mongoose';
import { setupRoutes } from './routes'

const app = express()

app.use(express.json())

setupRoutes(app)

app.use(errorHandler)

const start = async () => {
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


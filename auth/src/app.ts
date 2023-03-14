import "express-async-errors";

import cookieSession from 'cookie-session';
import { errorHandler } from './middlewares/errorHandler'
import express from 'express'
import { setupRoutes } from './routes'

const app = express()
app.set('trust proxy', true)

app.use(express.json())
app.use(cookieSession({
  signed: false,
  secure: true
}))

setupRoutes(app)

app.use(errorHandler)

export { app }
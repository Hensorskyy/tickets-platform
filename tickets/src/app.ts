import "express-async-errors";

import cookieSession from 'cookie-session';
import { errorHandler } from "@vhticketing/common";
import express from 'express'

const app = express()
app.set('trust proxy', true)

app.use(express.json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(errorHandler)

export { app }
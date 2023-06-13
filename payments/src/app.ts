import "express-async-errors";

import { errorHandler, userSet } from "@vhticketing/common";

import { chargeRouter } from "./routes/new";
import cookieSession from 'cookie-session';
import express from 'express'

const app = express()
app.set('trust proxy', true)

app.use(express.json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}))

app.use(userSet)

app.use(chargeRouter)

app.use(errorHandler)

export { app }
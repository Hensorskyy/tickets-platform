import { errorHandler } from './middlewares/errorHandler'
import express from 'express'
import { setupRoutes } from './routes'

const app = express()

app.use(express.json())

setupRoutes(app)

app.use(errorHandler)

app.listen(3000, () => {
  console.log('Listenning on port 3000!')
})
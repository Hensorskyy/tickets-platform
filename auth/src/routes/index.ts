import { Application, Router } from "express";

import { NotFoundError } from "@vhticketing/common";
import usersRoutes from "./users";

const apiRoutes = Router()
apiRoutes.use('/users', usersRoutes)

export const setupRoutes = (app: Application) => {
  app.use('/api', apiRoutes)
  app.all('*', () => {
    throw new NotFoundError()
  })
}


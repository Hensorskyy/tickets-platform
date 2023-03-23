import { NextFunction, Request, Response } from "express"

import { NotAuthorizedError } from "../errors/notAuthorized"

export const userAuthorizator = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError()
  }

  next()
}
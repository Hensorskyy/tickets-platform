import { NextFunction, Request, Response } from "express";

import { verify } from "jsonwebtoken";

interface UserPayload {
  id: string,
  email: string
}

declare global {
  namespace Express {
    export interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const userSetter = (req: Request, res: Response, next: NextFunction) => {
  const jwtToken = req?.session?.jwt

  if (!jwtToken) {
    next()
  }

  try {
    const payload = verify(
      jwtToken,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (err) { }

  next()
}
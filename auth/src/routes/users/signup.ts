import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";

import { DatabaseConnectionError } from "../../errors/databaseConnectionError";
import { RequestValidationError } from "../../errors/requestValidationError";

const signupRoute = Router();

signupRoute.post('/signup', [
  body('email')
    .isEmail()
    .withMessage('Email should be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
],
  (req: Request, res: Response) => {
    const errors = validationResult(req)

    console.log(errors)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors?.array())

    }

    throw new DatabaseConnectionError()
    console.log('Creating a user...')
    res.send('signup')
  })

export default signupRoute;
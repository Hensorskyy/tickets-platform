import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";

import { BadRequest } from "../../errors/badRequestError";
import { DatabaseConnectionError } from "../../errors/databaseConnectionError";
import { RequestValidationError } from "../../errors/requestValidationError";
import { User } from "../../models/user";

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
  async (req: Request, res: Response) => {
    const errors = validationResult(req)

    console.log(errors)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors?.array())
    }

    const { email, password } = req?.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequest('Email in use')
    }

    const user = User.build({ email, password })
    await user.save()

    res.status(201).send(user)
  })

export default signupRoute;
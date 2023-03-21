import { Request, Response, Router } from "express";

import { BadRequestError } from "../../errors/badRequestError";
import { User } from "../../models/user";
import { body } from "express-validator";
import { requestValidator } from "../../middlewares/requestValidator";
import { sign } from "jsonwebtoken";

const signupRoute = Router();

signupRoute.post('/signup', [
  body('email')
    .isEmail()
    .withMessage('Email should be valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters')
], requestValidator,
  async (req: Request, res: Response) => {
    const { email, password } = req?.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw new BadRequestError('Email in use')
    }

    const user = User.build({ email, password })
    await user.save()

    const userJwt = sign({ id: user?.id, email: user?.email }, process.env.JWT_KEY!)

    req.session = { jwt: userJwt };

    res.status(201).send(user)
  })

export default signupRoute;
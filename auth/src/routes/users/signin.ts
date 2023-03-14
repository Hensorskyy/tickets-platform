import { Request, Response, Router } from "express";

import { BadRequestError } from "../../errors/badRequestError";
import { Password } from "../../services.ts/password";
import { User } from "../../models/user";
import { body } from "express-validator";
import { requestValidator } from "../../middlewares/requestValidator";
import { sign } from "jsonwebtoken";

const signinRoute = Router();

signinRoute.post('/signin', [
  body('email')
    .isEmail()
    .withMessage('Email should be valid'),
  body('password')
    .trim()
], requestValidator, async (req: Request, res: Response) => {

  const { email, password } = req?.body

  const existingUser = await User.findOne({ email })

  if (!existingUser) {
    throw new BadRequestError('Invalid credentials')
  }

  const passwordsMatch = await Password.compare(existingUser.password, password)
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid Credentials');
  }

  const userJwt = sign(
    {
      id: existingUser.id,
      email: existingUser.email
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJwt
  };

  res.status(200).send(existingUser);
})

export default signinRoute;

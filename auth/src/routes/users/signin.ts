import { Router } from "express";

const signinRoute = Router();

signinRoute.post('/signin', (req, res) => {
  res.send('signin')
})

export default signinRoute;

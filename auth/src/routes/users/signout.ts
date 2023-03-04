import { Router } from "express";

const signoutRoute = Router();

signoutRoute.post('/signin', (req, res) => {
  res.send('signoutRoute')
})

export default signoutRoute;
import { Router } from "express";

const signoutRoute = Router();

signoutRoute.post('/signout', (req, res) => {
  res.clearCookie("jwt");

  res.end()
})

export default signoutRoute;
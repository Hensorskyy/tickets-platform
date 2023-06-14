import { Router } from "express";

const signoutRoute = Router();

signoutRoute.post("/signout", (req, res) => {
  req.session = null;

  res.end();
});

export default signoutRoute;

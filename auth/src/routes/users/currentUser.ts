import { Router } from "express";
import { userSet } from "@vhticketing/common";
;

const currentUserRoute = Router();

currentUserRoute.get('/currentUser', userSet, (req, res) => {
  res.status(200).send({ currentUser: req.currentUser || null });
})

export default currentUserRoute;

import { Router } from "express";
import { userSetter } from "@vhticketing/common";
;

const currentUserRoute = Router();

currentUserRoute.get('/currentUser', userSetter, (req, res) => {
  res.status(200).send({ currentUser: req.currentUser || null });
})

export default currentUserRoute;

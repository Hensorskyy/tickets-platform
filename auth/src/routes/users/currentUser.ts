import { Router } from "express";
import { userAuthorizator } from "../../middlewares/userAuthorizator";
import { userSetter } from "../../middlewares/userSetter";

const currentUserRoute = Router();

currentUserRoute.get('/currentUser', userSetter, userAuthorizator, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
})

export default currentUserRoute;

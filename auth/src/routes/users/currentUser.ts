import { Router } from "express";

const currentUserRoute = Router();

currentUserRoute.get('/currentUser', (req, res) => {
  res.send('it is VH')
})

export default currentUserRoute;

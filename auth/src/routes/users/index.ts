import { Router } from "express";
import currentUserRoute from "./currentUser";
import signinRoute from "./signin";
import signoutRoute from "./signout";
import signupRoute from "./signup";

const usersRoutes = Router();

usersRoutes.use(currentUserRoute)
usersRoutes.use(signinRoute)
usersRoutes.use(signupRoute)
usersRoutes.use(signoutRoute)

export default usersRoutes;

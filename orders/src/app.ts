import "express-async-errors";

import { errorHandler, userSet } from "@vhticketing/common";

import cookieSession from "cookie-session";
import express from "express";
import { setupRoutes } from "./routes";

const app = express();
app.set("trust proxy", true);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(userSet);

setupRoutes(app);

app.use(errorHandler);

export { app };

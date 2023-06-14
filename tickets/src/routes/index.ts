import { Application, Router } from "express";

import { NotFoundError } from "@vhticketing/common";
import apiRoutes from "./apiRoutes";

export const setupRoutes = (app: Application) => {
  app.use("/api", apiRoutes);
  app.all("*", () => {
    throw new NotFoundError();
  });
};

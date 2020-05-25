import express from "express";
import { cors, logger, referral } from "../middlewares";
import router from "../router";

export default (app: express.Application) => {
  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(cors("*"));
  app.use(logger());
  app.use(referral());
  app.use("/api/v1", router);
}

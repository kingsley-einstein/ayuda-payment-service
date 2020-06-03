import express from "express";
import actuator from "express-actuator";
import { cors, logger, referral } from "../middlewares";
import router from "../router";

export default (app: express.Application) => {
  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));
  app.use(cors("*"));
  app.use(logger());
  // app.use(referral());
  app.use(actuator());
  app.use("/api/v1", router);
  // app.get("/info", (req, res) => {
  //   res.status(200).json({
  //     message: "App is running"
  //   });
  // });
  app.get("/", (req, res) => {
    res.status(200).json({
      path: req.path,
      status: res.statusCode,
      message: res.statusMessage
    });
  });
}

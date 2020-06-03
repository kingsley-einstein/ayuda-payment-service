import express from "express";
import { Server as ApplicationServer } from "http";
import fs from "fs";
import config from "./config";
import env from "./env";

export class Server {
  app: express.Application;

  constructor() {
    // this.app = express();
    this.configure();
  }

  configure(): void {
    this.app = express();
    config(this.app);
  }

  start(cb: (port: number) => void): ApplicationServer {
    return this.app.listen(env.port[process.env.NODE_ENV], () => {
      cb(env.port[process.env.NODE_ENV]);
    });
  }

  // For tests
  application(): express.Application {
    return this.app;
  }
}

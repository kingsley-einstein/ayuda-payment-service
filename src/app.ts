import mongoose from "mongoose";
import { Server } from "./server";
import env from "./env";
import { Config, Eureka } from "./spring-cloud";

const server = new Server();
const config = new Config();

server.start(async (port) => {
  console.log(`Server running on port: ${port}`);
  const m = await mongoose.connect(env.db[process.env.NODE_ENV], {
    useNewUrlParser: true,
    useCreateIndex: true
  });
  if (m) console.log("Mongoose connected");

  if (process.env.NODE_ENV !== "test") {
    await config.configure();

    const eureka = new Eureka(
      config.getConfig("eureka.instance.id"),
      config.getConfig("eureka.instance.name"),
      config.getConfig("eureka.instance.hostname"),
      config.getConfig("eureka.instance.ip"),
      config.getConfig("eureka.instance.vipAddress"),
      config.getConfig("eureka.host"),
      config.getConfig("eureka.instance.hostname") + "/info",
      config.getConfig("eureka.instance.hostname") + "/"
    );

    eureka.start();
  }
});

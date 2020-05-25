import CloudConfig, { Config as SpringConfig } from "cloud-config-client";
import env from "../env";

export class Config {
  config: SpringConfig | Error;

  async configure() {
    this.config = await CloudConfig.load({
      endpoint: env.cloudConfig.endpoint,
      profiles: env.cloudConfig.profiles,
      name: env.cloudConfig.app
    })
  }

  getConfig(property: string) {
    return this.config instanceof SpringConfig ? this.config.get(property) : new Error("Could not load " + property); 
  }
}

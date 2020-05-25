import { Eureka as EurekaObject } from "eureka-js-client";

export class Eureka {
  eureka: EurekaObject;
  constructor(
    instanceId: string,
    app: string,
    hostName: string,
    ipAddr: string,
    vipAddress: string,
    eurekaUrl: string
  ) {
    this.eureka = new EurekaObject({
      instance: {
        instanceId,
        app,
        hostName,
        ipAddr,
        vipAddress,
        dataCenterInfo: {
          name: "MyOwn",
          "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo"
        }
      },
      eureka: {
        serviceUrls: {
          default: [
            `${eurekaUrl}/eureka/apps`
          ]
        }
      }
    });
  }

  start() {
    this.eureka.start((err, rest) => {
      console.log(err.message);
    });
  }
}

import { Eureka as EurekaObject } from "eureka-js-client";

export class Eureka {
  eureka: EurekaObject;
  constructor(
    instanceId: string,
    app: string,
    hostName: string,
    ipAddr: string,
    vipAddress: string,
    eurekaUrl: string,
    statusPageUrl: string,
    homePageUrl: string
  ) {
    this.eureka = new EurekaObject({
      instance: {
        instanceId,
        app,
        hostName,
        ipAddr,
        vipAddress,
        statusPageUrl,
        homePageUrl,
        port: {
          "@enabled": process.env.NODE_ENV === "development",
          $: parseInt(process.env.PORT)
        },
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
      if (err) console.log(err.message);
    });
  }
}

import rp from "request-promise";
import fs from "fs";
import path from "path";
import env from "../env";

const referralAPI = env.referral_service + "/api/v1/owned";

export const referral = () => {
  return async (req: any, res: any, next: any) => {
    const { headers } = req;
    // console.log(referralAPI);
    const referralResponse = await rp.get(referralAPI, {
     json: true,
     simple: false,
     resolveWithFullResponse: true,
     headers,
     agentOptions: {
      key: fs.readFileSync(path.join(__dirname, "../certs/key.pem")),
      cert: fs.readFileSync(path.join(__dirname, "../certs/cert.pem")),
      passphrase: env.rqPassPhrase
     }
    });
    // console.log(referralResponse);
    if (referralResponse.statusCode >= 400) {
      return res.status(referralResponse.statusCode).json({
        code: referralResponse.statusCode,
        response: referralResponse.body.response || referralResponse.body
      });
    }
    req.referral = referralResponse.body.response;
    next();
  }
}

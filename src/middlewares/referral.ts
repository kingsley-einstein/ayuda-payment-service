import rp from "request-promise";
import env from "../env";

export const referral = () => {
  return async (req: any, res: any, next: any) => {
    const { headers } = req;
    // console.log(referralAPI);
    const referralResponse = await rp({ host: env.referral_service, uri: "/api/v1/owned", json: true, resolveWithFullResponse: true, simple: false, headers });
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

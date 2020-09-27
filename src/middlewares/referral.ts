import rp from "request-promise";
import env from "../env";

export const referral = () => {
  return async (req: any, res: any, next: any) => {
    const { headers } = req;
    const referralAPI = env.referral_service + "/api/v1/owned"
    console.log(referralAPI);
    const referralResponse = await rp.get(referralAPI, {
      headers, json: true, resolveWithFullResponse: true, timeout: 120000, simple: false
    });
    if (referralResponse.statusCode >= 400) {
      return res.status(referralResponse.statusCode).json({
        code: referralResponse.statusCode,
        response: referralResponse.body.response || referralResponse.body
      })
    }
    req.referral = referralResponse.body.response;
    next();
  }
}

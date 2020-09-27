import rp from "request-promise";
import env from "../env";

export const referral = () => {
  return async (req: any, res: any, next: any) => {
    const { headers } = req;
    const referralAPI = env.referral_service + "/api/v1/owned"
    console.log(referralAPI);
    rp.get(referralAPI, { headers, json: true }).then((r) => console.log(r));
    const referralResponse = await rp.get(referralAPI, {
      headers, json: true, resolveWithFullResponse: true, timeout: 120000,
    });
    if (referralResponse.statusCode >= 400) {
      return res.status(referralResponse.statusCode).json({
        code: referralResponse.statusCode,
        response: referralResponse.body.response
      })
    }
    req.referral = referralResponse.body.response;
    next();
  }
}

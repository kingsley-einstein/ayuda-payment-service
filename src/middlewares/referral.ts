import rp from "request-promise";
import env from "../env";

export const referral = () => {
  return async (req: any, res: any, next: any) => {
    const { headers } = req;
    const referralResponse = await rp.get(`${env.referral_service}/api/v1/owned`, {
      headers, json: true, resolveWithFullResponse: true,
    });
    console.log(referralResponse, env.referral_service);
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

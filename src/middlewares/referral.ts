import axios from "axios";
import env from "../env";

export const referral = () => {
  return async (req: any, res: any, next: any) => {
    const { headers } = req;
    const referralAPI = env.referral_service + "/api/v1/owned"
    console.log(referralAPI);
    const referralResponse = await axios.get(referralAPI, { headers });
    if (referralResponse.status >= 400) {
      return res.status(referralResponse.status).json({
        code: referralResponse.status,
        response: referralResponse.data.response
      })
    }
    req.referral = referralResponse.data.response;
    next();
  }
}

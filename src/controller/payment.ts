import rp from "request-promise";
import { Payment } from "../db";
import { Payment as PaymentCore } from "../payment";
import env from "../env";

const payment = new Payment();
const paymentCore = new PaymentCore();

export class PaymentController {
  static async create(req: any, res: any) {
    try {
      const { referral } = req;
      // const referral = await rp.get("", {
      //   headers, json: true
      // });
      const payExists = await payment.findByReference(referral.id);
      
      if (payExists) {
        return res.status(400).json({
          code: 400,
          response: "You already have a pending payment."
        });
      }

      const pay: any = await payment.create({
        amount: referral.amountType,
        reference: referral.id
      });
      // const updatedPay = await payment.updateByReference(pay.reference, {
      //   dueDate: new Date(
      //     new Date().setDate(
      //       pay.createdAt.getDate() + 14
      //     ) 
      //   )
      // });
      res.status(201).json({
        code: 201,
        response: pay
      });
    } catch ({ message }) {
      res.status(500).json({
        code: 500,
        response: message
      });
    }
  }

  static async findByReference(req: any, res: any) {
    try {
      const { referral } = req;
      // const referral = await rp.get("", {
      //   headers, json: true
      // });
      const pay = await payment.findByReference(referral.id);
      res.status(200).json({
        code: 200,
        response: pay
      });
    } catch ({ message }) {
      res.status(500).json({
        code: 500,
        response: message
      });
    }
  }

  static async initializePayment(req: any, res: any) {
    try {
      const { referral, body } = req;
      const paymentInitialization = await paymentCore.initializeTransaction(
        (referral.amountType * 100), 
        referral.id, 
        body.name, 
        body.email, 
        body.callback_url,
        body.currency || "NGN"
      );
      if (!paymentInitialization.status) {
        return res.status(400).json({
          code: 400,
          response: paymentInitialization.message
        });
      }
      res.status(200).json({
        code: 200,
        response: {
          referral,
          payment: paymentInitialization.data
        }
      });
    } catch ({ message }) {
      res.status(500).json({
        code: 500,
        response: message
      });
    }
  }

  static async verifyPayment(req: any, res: any) {
    try {
      const { referral } = req;
      const paymentVerification = await paymentCore.verifyTransaction(referral.id);
      const updatedPay = await payment.updateByReference(referral.id, {
        dueDate: new Date(
          new Date().setDate(
            new Date().getDate() + 14
          )
        ),
        paid: true
      });
      res.status(200).json({
        code: 200,
        response: {
          paymentVerification,
          payment: updatedPay
        }
      });
    } catch ({ message }) {
      res.status(500).json({
        code: 500,
        response: message
      });
    }
  }

  static async deletePayment(req: any, res: any) {
    try {
      const { referral } = req;
      const deletedPay = await payment.deleteByReference(referral.id);
      res.status(200).json({
        code: 200,
        response: {
          deletedPayment: deletedPay
        }
      });
    } catch ({ message }) {
      res.status(500).json({
        code: 500,
        response: message
      });
    }
  }

  static async createTransferRecipient(req: any, res: any) {
    try {
      const { referral, body } = req;
      const recipient = await paymentCore.createTransferRecipient(
        body.accountNumber,
        body.bankName,
        body.name,
        undefined,
        {
          referralCode: referral.id
        }
      );
      res.status(200).json({
        code: 200,
        response: {
          referral, recipient
        }
      });
    } catch ({ message }) {
      res.status(500).json({
        code: 500,
        response: message
      });
    }
  }

  static async initializeTransfer(req: any, res: any) {
    try {
      const { referral, body } = req;
      const referredResponse = await rp.get(`${referral.id}`, {
        json: true, resolveWithFullResponse: true
      });

      if (referredResponse.statusCode >= 400) {
        return res.status(referredResponse.statusCode).json({
          code: referredResponse.statusCode,
          response: referredResponse.body.response
        });
      }

      const referralList: any[] = referredResponse.body.response;
      const payments: any[] = [];

      referralList.forEach(async (r) => {
        payments.concat(
          await payment.findByReference(r.id)
        );
      });

      const paid: any[] = payments.filter((p) => p.paid);

      if (paid.length < 10) {
        return res.status(400).json({
          code: 400,
          response: `${10 - paid.length} of your referrals ${10 - paid.length > 1 ? "have" : "has" } not made or verified a payment yet.`
        });
      }

      const pay: any = await payment.findByReference(referral.id);

      if (new Date(pay.dueDate) > new Date() && referralList.length < 10) {
        return res.status(400).json({
          code: 400,
          response: "You can't withdraw yet."
        });
      }

      const amountToReceive = referralList.length === 10 ? (referral.amountType * 8 * 100) : (referral.amountType * 0.95 * 100);

      const initializedTransfer = await paymentCore.initiateTransfer(
        "balance", amountToReceive, body.recipientCode
      );

      res.status(200).json({
        code: 200,
        response: {
          referral,
          withdrawal: initializedTransfer
        }
      });
    } catch ({ message }) {
      res.status(500).json({
        code: 500,
        response: message
      });
    }
  }

  static async finalizeTransfer(req: any, res: any) {
    try {
      const { referral, body, headers } = req;
      const finalizedTransfer = await paymentCore.finalizeTransfer(
        body.code, body.otp
      );
      const newReferralCodeResponse = await rp.patch("", {
        headers, json: true, resolveWithFullResponse: true
      });

      if (newReferralCodeResponse.statusCode >= 400) {
        return res.status(newReferralCodeResponse.statusCode).json({
          code: newReferralCodeResponse.statusCode,
          response: newReferralCodeResponse.body.response
        });
      }

      const pay = await payment.deleteByReference(referral.id);
      res.status(200).json({
        code: 200,
        response: {
          referral,
          withdrawal: finalizedTransfer,
          message: newReferralCodeResponse.body.response,
          formerPaymentObject: pay
        }
      });
    } catch ({ message }) {
      res.status(500).json({
        code: 500,
        response: message
      });
    }
  }
}

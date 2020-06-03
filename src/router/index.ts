import { Router } from "express";
import { PaymentController } from "../controller";
import { referral } from "../middlewares";

const router = Router();

router.post("/payment/create", referral(), PaymentController.create);
router.post("/payment/initialize", referral(), PaymentController.initializePayment);
router.post("/transfer/recipient", referral(), PaymentController.createTransferRecipient);
router.post("/transfer/initialize", referral(), PaymentController.initializeTransfer);
// router.post("/transfer/finalize", PaymentController.finalizeTransfer);

router.get("/payment/find", referral(), PaymentController.findByReference);
router.get("/payment/verify", referral(), PaymentController.verifyPayment);
router.get("/transfer/retrieve", referral(), PaymentController.getTransfer);

router.delete("/payment/delete", referral(), PaymentController.deletePayment);

export default router;

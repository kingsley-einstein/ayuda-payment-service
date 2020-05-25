import { Router } from "express";
import { PaymentController } from "../controller";

const router = Router();

router.post("/payment/create", PaymentController.create);
router.post("/payment/initialize", PaymentController.initializePayment);
router.post("/transfer/recipient", PaymentController.createTransferRecipient);
router.post("/transfer/initialize", PaymentController.initializeTransfer);
router.post("/transfer/finalize", PaymentController.finalizeTransfer);

router.get("/payment/find", PaymentController.findByReference);
router.get("/payment/verify", PaymentController.verifyPayment);

router.delete("/payment/delete", PaymentController.deletePayment);

export default router;

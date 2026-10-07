import { Router } from "express";
import { 
    getPaymentByOrderIdController,
    createPayHereCheckoutController,
    payHereNotificationController
} from "../controllers/payment.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/order/:orderId",
  requireAdmin,
  getPaymentByOrderIdController
);

router.get(
  "/payhere/:orderId",
  createPayHereCheckoutController
);

router.post(
  "/payhere/notify",
  payHereNotificationController
);

export default router;
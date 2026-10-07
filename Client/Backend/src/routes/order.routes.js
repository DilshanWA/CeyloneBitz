import { Router } from "express";

import {
  createOrderController,
  getOrderController,
  getOrderByIdController,
  updateOrderStatusController,
  getWhatsAppOrderController
} from "../controllers/order.controller.js";

import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Customer checkout
router.post("/", createOrderController);
router.get("/:id/whatsapp", getWhatsAppOrderController);

// Admin order management
router.get("/", requireAdmin, getOrderController);
router.get("/:id", requireAdmin, getOrderByIdController);
router.patch("/:id/status", requireAdmin, updateOrderStatusController);

export default router;
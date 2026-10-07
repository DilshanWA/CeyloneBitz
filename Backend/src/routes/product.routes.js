import { Router } from "express";

import {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deactivateProductController
} from "../controllers/product.controller.js";

import { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

//Public routes
router.get("/", getProductsController);
router.get("/:id", getProductByIdController);

//Admin routes
router.post("/", requireAdmin, createProductController);
router.patch("/:id", requireAdmin, updateProductController);
router.delete("/:id", requireAdmin, deactivateProductController);

export default router;
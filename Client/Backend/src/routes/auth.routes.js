import { Router } from "express";
import {
  loginController,
  getCurrentAdminController,
  logoutController,
} from "../controllers/auth.controller.js";

import { requireAdmin } from "../middleware/auth.middleware.js";
import { authRateLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/login",authRateLimiter, loginController);

router.get(
  "/me",
  requireAdmin,
  getCurrentAdminController
);

router.post(
  "/logout",
  requireAdmin,
  logoutController
);

export default router;
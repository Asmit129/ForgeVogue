import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders); // the frontend still uses /myorders in profile logic? Wait no, we fixed the frontend to use /my-orders previously?
router.get("/my-orders", protect, getMyOrders); // Supporting both for backward compat
router.get("/:id", protect, getOrderById);

// Admin routes
router.get("/admin/analytics", protect, admin, getAdminAnalytics);
router.get("/admin/all", protect, admin, getAllOrders);
router.put("/admin/:id", protect, admin, updateOrderStatus);

export default router;

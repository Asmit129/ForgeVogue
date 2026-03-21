import express from "express";
import { createCoupon, getAllCoupons, validateCoupon, deleteCoupon } from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createCoupon);
router.get("/", protect, admin, getAllCoupons);
router.post("/validate", protect, validateCoupon);
router.delete("/:id", protect, admin, deleteCoupon);

export default router;

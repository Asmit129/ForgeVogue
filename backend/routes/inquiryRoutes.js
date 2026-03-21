import express from "express";
import {
  createInquiry,
  getMyInquiries,
  getAllInquiries,
  updateInquiryAdmin
} from "../controllers/inquiryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createInquiry);
router.get("/my-inquiries", protect, getMyInquiries);

// Admin routes
router.get("/admin/all", protect, admin, getAllInquiries);
router.put("/admin/:id", protect, admin, updateInquiryAdmin);

export default router;

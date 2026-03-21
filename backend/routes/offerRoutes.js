import express from "express";
import {
  createOffer,
  getMyOffers,
  getReceivedOffers,
  updateOfferStatus,
  getAllOffers
} from "../controllers/offerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOffer);
router.get("/my-offers", protect, getMyOffers);
router.get("/received", protect, getReceivedOffers);
router.put("/:id/status", protect, updateOfferStatus);
router.get("/admin/all", protect, admin, getAllOffers);

export default router;

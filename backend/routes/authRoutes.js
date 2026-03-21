import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers,
  toggleWatchlist,
  getWatchlist,
  getSellerProfile
} from "../controllers/authController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);
router.get("/users", protect, admin, getAllUsers);
router.post("/watchlist/:id", protect, toggleWatchlist);
router.get("/watchlist", protect, getWatchlist);

// Public Routes
router.get("/seller/:id", getSellerProfile);

export default router;

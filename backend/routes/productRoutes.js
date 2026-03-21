import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  getMyListings,
  getAllProductsAdmin,
  verifyProduct,
  deleteProduct,
  searchProducts,
  getRelatedProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/single/:id", getProductById);
router.get("/single/:id/related", getRelatedProducts);

// Authenticated user
router.post("/", protect, upload.array("images", 5), createProduct);
router.get("/my-listings", protect, getMyListings);

// Admin
router.get("/admin/all", protect, admin, getAllProductsAdmin);
router.put("/admin/:id/verify", protect, admin, verifyProduct);
router.delete("/admin/:id", protect, admin, deleteProduct);

export default router;

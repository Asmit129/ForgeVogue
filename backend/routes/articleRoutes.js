import express from "express";
import {
  getArticles,
  getArticleBySlug,
  createArticle
} from "../controllers/articleController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getArticles); // Public
router.get("/:slug", getArticleBySlug); // Public
router.post("/", protect, admin, createArticle); // Admin Only

export default router;

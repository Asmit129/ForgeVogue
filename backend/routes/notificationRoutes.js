import express from "express";
import { getMyNotifications, markAllRead, markOneRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.put("/read", protect, markAllRead);
router.put("/:id/read", protect, markOneRead);

export default router;

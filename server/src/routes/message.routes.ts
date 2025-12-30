import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { allmessages, sendMessages } from "../controllers/message.controller";
const router = Router();

router.post("/messages", authMiddleware, sendMessages);
router.get("/channels/:id/messages", authMiddleware, allmessages);

export default router;

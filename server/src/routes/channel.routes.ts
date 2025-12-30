import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createChannel,
  joinChannel,
  allChannels,
} from "../controllers/channel.controller";
const router = Router();

router.post("/create-channel", authMiddleware, createChannel);
router.post("/join-channel", authMiddleware, joinChannel);
router.post("/channels", authMiddleware, allChannels);

export default router;

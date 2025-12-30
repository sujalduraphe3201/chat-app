import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const allmessages = async (req: Request, res: Response) => {
  try {
    const channelId = req.params.id;
    const userId = req.userId!;
    if (!channelId) {
      return res.status(400).json({ message: "Channel id is required" });
    }
    const isMember = await prisma.channelMember.findUnique({
      where: {
        userId_channelId: {
          channelId,
          userId,
        },
      },
    });
    if (!isMember) {
      res.status(403).json({ message: "Not a channel member" });
      return;
    }
    const messages = await prisma.message.findMany({
      where: {
        channelId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      select: {
        content: true,
        sender: true,
      },
    });
    res.status(200).json({
      message: "recent messages fetched",
      data: messages,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error while get last 50 messages" });
  }
};

export const sendMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { content, channelId } = req.body;
    if (!channelId || !content) {
      return res.status(400).json({ message: "Channel id is required" });
    }
    const isMember = await prisma.channelMember.findUnique({
      where: {
        userId_channelId: {
          userId,
          channelId,
        },
      },
    });

    if (!isMember) {
      return res.status(403).json({ message: "Not a channel member" });
    }
    const message = await prisma.message.create({
      data: {
        content,
        userId,
        channelId,
      },
      select: {
        content: true,
    
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error while saving message" });
  }
};

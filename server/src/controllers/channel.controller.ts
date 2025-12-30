import { Request, Response } from "express";
import { prisma } from "../config/prisma";

export const createChannel = async (req: Request, res: Response) => {
  const userId = req.userId!;
  try {
    const { name, isPrivate = false } = req.body;
    if (!name) {
      res.status(400).json({
        message: "All fields are required",
      });
      return;
    }
    const user = await prisma.channel.create({
      data: {
        name: name,
        isPrivate: isPrivate,
        members: {
          create: {
            userId,
          },
        },
      },
    });
    res.status(201).json({
      message: "Channel created successfully",
      data: {
        id: user.id,
        name: user.name,
        private: user.isPrivate,
      },
    });
  } catch (err) {
    console.log("server error while creating channel");
    return;
  }
};

export const joinChannel = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.body;
    const userId = req.userId!;
    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is required" });
    }

    const existing = await prisma.channelMember.findUnique({
      where: {
        userId_channelId: {
          channelId,
          userId,
        },
      },
    });
    if (existing) {
      return res.status(409).json({ message: "Already a member" });
    }

    const channel = await prisma.channelMember.create({
      data: {
        channelId: channelId,
        userId: userId,
      },
    });
    res.status(200).json({ message: "joined channel" });
  } catch (err) {
    console.log("Server error while joining a channel");
    return;
  }
};

export const allChannels = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const allchannels = await prisma.channel.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        isPrivate: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      channels: allchannels,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error while getting all channels",
    });
  }
};

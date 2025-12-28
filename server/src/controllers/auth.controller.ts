import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "default";
import jwt from "jsonwebtoken";
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ message: "All field are required" });
      return;
    }
    const existinguser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (existinguser) {
      res.status(400).json({ message: "Email already exist " });
      return;
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPass,
        name: name,
      },
    });

    res.status(200).json({
      message: "User Created Successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch {
    return res.status(500).json({ message: "Login failed" });
  }
};

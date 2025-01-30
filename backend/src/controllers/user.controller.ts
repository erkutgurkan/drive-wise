import { Request, Response } from "express";
import User from "../models/userModel";

export const getUser = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      console.error("An unknown error occurred");
    }
  }
};

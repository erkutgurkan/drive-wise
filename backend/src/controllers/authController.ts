import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import dotenv from "dotenv";
import User from "../models/userModel";

dotenv.config();

// create token with user id
const createToken = (_id: string) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

// controller function to register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });

    if (!name || !email || !password) {
      res.status(400).json({ error: "Please fill all the fields" });
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(400).json({ error: "Email is not valid" });
      return;
    }

    if (!validator.isStrongPassword(password)) {
      res.status(400).json({ error: "Password is not strong enough" });
      return;
    }

    if (exists) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    const newEntry = await newUser.save();

    // Generate JWT Token
    const token = createToken(newEntry._id as string);

    res.status(201).json({ newUser, token });
    return;
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(400)
        .json({ status: "400 Bad Request", message: error.message });
      return;
    } else {
      res.status(500).json({
        status: "500 Internal Server Error",
        message: "500 Internal Server Error, User not created",
      });
      return;
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const login = await User.findOne({ email });

    if (!login) {
      res
        .status(404)
        .json({ message: "Email not found", status: "404 Not Found" });
      return;
    }

    const validPassword = await bcrypt.compare(password, login.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Invalid Password", status: "400 Bad Request" });
      return;
    }

    const token = createToken(login._id as string);

    res.status(200).json({ login, token });
    return;
  } catch (error) {
    res.status(500).json({
      status: "500 Internal Server Error",
      message: "500 Internal Server Error, User not logged in",
    });
    return;
  }
};

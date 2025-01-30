import express from "express";
import userRoutes from "./user.route";
import authRoutes from "./authRoutes";

const router = express.Router();

console.log("Routes loaded");

router.use("/", authRoutes);

export default router;

import express from "express";
import userRoutes from "./user.route";

const router = express.Router();

console.log("Routes loaded");

router.use("/users", userRoutes);

export default router;

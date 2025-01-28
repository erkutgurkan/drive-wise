import express from "express";
import { getUser } from "../controllers/user.controller";

const router = express.Router();

console.log("User route registered");

// GET all users
router.get("/", getUser);

export default router;

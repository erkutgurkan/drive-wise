import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import connectDB from "./config/database";

dotenv.config();

const app: Express = express();

app.use(cors()); // Cross-origin
app.use(express.json()); // Middleware
app.use(express.urlencoded({ extended: true }));

// Connect to the mongo db
connectDB().then((res) => {
  console.log(res);
});

// API routes
app.use("/api", routes);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).send("Not Found");
});

export default app;

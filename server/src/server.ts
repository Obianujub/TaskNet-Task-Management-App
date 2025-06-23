import { connectDB } from "./db/db";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 5173;
app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Task Manager Server is Live");
});

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});

import express, { Router, RequestHandler } from "express";
import { verifyToken } from "../middleware/verifyToken";
import {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

const router: Router = express.Router();

router.post(
  "/add-task",
  verifyToken as RequestHandler,
  addTask as RequestHandler
);
router.get(
  "/all-tasks",
  verifyToken as RequestHandler,
  getAllTasks as RequestHandler
);
router.put(
  "/update-task/:id",
  verifyToken as RequestHandler,
  updateTask as RequestHandler
);
router.delete(
  "/delete-task/:id",
  verifyToken as RequestHandler,
  deleteTask as RequestHandler
);

export default router;

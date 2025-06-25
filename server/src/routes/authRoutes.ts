import express, { Router, RequestHandler } from "express";
import { checkAuth, login, register } from "../controllers/authController";
import { verifyToken } from "../middleware/verifyToken";

const router: Router = express.Router();

router.post("/login", login as RequestHandler);
router.post("/register", register as RequestHandler);
router.post(
  "/checkAuth",
  verifyToken as RequestHandler,
  checkAuth as RequestHandler
);

export default router;

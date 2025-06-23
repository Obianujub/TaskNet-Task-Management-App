import express, { Router, RequestHandler } from "express";
import { checkAuth, login, signup } from "../controllers/authController";
import { verifyToken } from "../middleware/verifyTokens";

const router: Router = express.Router();

router.post("/login", login as RequestHandler);
router.post("/signup", signup as RequestHandler);
router.post(
  "/checkAuth",
  verifyToken as RequestHandler,
  checkAuth as RequestHandler
);

export default router;

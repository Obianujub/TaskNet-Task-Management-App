import { Response, NextFunction } from "express";
import JWT, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../types/authTypes";

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Not Authorized, No Token" });
  }
  try {
    const decoded = JWT.verify(
      token,
      process.env.JWT_SECRET || ""
    ) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not Authorized, Invalid token" });
  }
};

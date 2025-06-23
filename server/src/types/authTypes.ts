import { Request } from "express";

export interface SignUpBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
export interface CustomRequest<P = any, ResBody = any, ReqBody = any>
  extends Request<P, ResBody, ReqBody> {
  userId?: string;
}

import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

type AuthClaims = JwtPayload & {
  sub: string;   // user id
  name?: string;
};

export function requireUser(req: Request, res: Response, next: NextFunction) {

  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).send({ Message: "Missing token" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).send({ Message: "Missing JWT_SECRET" });
  }

  try {
    jwt.verify(token, secret) as AuthClaims;
    return next();
  } catch (error) {
    return res.status(401).send({ Message: "Invalid or expired token" });
  }

}

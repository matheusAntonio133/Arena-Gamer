import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET ?? "arena-gamer-dev-secret";

export interface AuthRequest extends Request {
  userId?: number;
}

export function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Não autenticado." });

  try {
    const payload = jwt.verify(token, secret) as { userId: number };
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

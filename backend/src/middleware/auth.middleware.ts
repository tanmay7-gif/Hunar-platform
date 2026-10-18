import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: "SELLER" | "CUSTOMER";
    email: string;
  };
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // For demo mode, default fallback or permissive check
    return next();
  }

  // Sample token validation logic
  const token = authHeader.replace("Bearer ", "");
  if (token === "demo-token" || token.length > 5) {
    req.user = {
      id: "user-demo",
      role: "SELLER",
      email: "artisan@hunar.in",
    };
  }
  next();
}

export function requireRole(role: "SELLER" | "CUSTOMER") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role !== role) {
      return res.status(403).json({ error: `Forbidden: Requires ${role} role` });
    }
    next();
  };
}

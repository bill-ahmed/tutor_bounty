import { Request, Response, NextFunction } from "express";

/** Ensures user is authenticated. If not, request is rejected with 401. */
export function RequireAuthentication(req: Request, res: Response, next: NextFunction) {
  if(!req.user)
    return res.sendStatus(401);
  
  next();
}

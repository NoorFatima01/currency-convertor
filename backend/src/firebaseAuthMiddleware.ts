// src/firebaseAuthMiddleware.ts
import { NextFunction, Request, Response } from "express";
import { auth } from "./firebaseAdmin";

const firebaseAuthMiddleware = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  try {
    if (!idToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default firebaseAuthMiddleware;

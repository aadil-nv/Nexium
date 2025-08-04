import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwt";
import { HttpStatusCode } from "../utils/httpStatusCodes";

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

const authenticateToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken; 

  if (!token) {
    return res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "Access denied. No token provided" });
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(HttpStatusCode.UNAUTHORIZED ).json({ message: "Invalid token" });
  }

  req.user = decoded; 
  next();
};

export default authenticateToken;

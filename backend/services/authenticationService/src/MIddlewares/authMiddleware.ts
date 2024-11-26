import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided' });
    }

    const _secret = process.env.ACCESS_TOKEN_SECRET;
    if (!_secret) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    jwt.verify(token, _secret, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      console.log(`Middleware autharaisation completed`.bgWhite);
      
      req.user = decoded as JwtPayload;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: 'An error occurred during authentication' });
  }
};

export default authenticateToken;

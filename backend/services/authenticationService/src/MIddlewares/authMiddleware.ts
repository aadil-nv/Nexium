import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include user property
interface CustomRequest extends Request {
    user?: string | JwtPayload; // Allow user to be a string or JwtPayload
}

// Middleware function to authenticate the token
const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log("Incoming Cookies:", req.cookies); // Log incoming cookies for debugging

    try {
        // Retrieve the token from cookies
        const token = req.cookies?.accessToken; // Use optional chaining to safely access the cookie
        console.log("token", token); // Log the token
        
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided" });
        }

        const secret = process.env.ACCESS_TOKEN_SECRET; // Get the secret from environment variables
        if (!secret) {
            console.error('Access token secret is not defined');
            return res.status(500).json({ message: 'Internal server error' }); // Return a 500 error if the secret is not defined
        }

        // Verify the token
        jwt.verify(token, secret, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
            if (err) {
                console.error("Token verification failed:", err);
                return res.status(401).json({ message: 'Invalid token' });
            }

            req.user = decoded as JwtPayload; // Attach the decoded user info to the request
            next(); // Call the next middleware
        });

    } catch (error) {
        console.error('Error in authenticateToken:', error);
        return res.status(500).json({ message: 'An error occurred during authentication' });
    }
};

export default authenticateToken;

import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include user property
interface CustomRequest extends Request {
    user?: string | JwtPayload; // Allow user to be a string or JwtPayload
}

// Middleware function to authenticate the token
const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    // console.log("Incoming Cookies:", req.cookies); // Log incoming cookies for debugging

    try {
        // Retrieve the token from cookies
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cGRhdGVkQ29tcGFueSI6eyJzdWJzY3JpcHRpb24iOnsicGxhbk5hbWUiOiJUcmlhbCIsInBsYW5UeXBlIjoiVHJpYWwiLCJzdGFydERhdGUiOiIyMDI0LTEwLTI5VDA0OjM5OjMxLjM4M1oiLCJlbmREYXRlIjoiMjAyNC0xMS0wNVQwNDozOTozMS4zODNaIiwic3RhdHVzIjoiQWN0aXZlIn0sIl9pZCI6IjY3MjA2NmUzMTBiNDM0ZDZjZmVhZjYwOCIsIm5hbWUiOiJuaWtlIiwiZW1haWwiOiJuaWtlQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDEwJGJZOWt6WEZ2YnhqU1ByLmlFWHBFSC5nL0NNd3p0bnRxL01LWGEzMDhLbU14WDlvVHVBTGRXIiwiYWRkcmVzcyI6ImxvY2FsIiwicGhvbmUiOiI5ODk4OTg5ODk4Iiwid2Vic2l0ZSI6IiIsInJlZ2lzdHJhdGlvbk51bWJlciI6IlJFRy0xMjMiLCJpc1ZlcmlmaWVkIjp0cnVlLCJyb2xlIjoiQnVzaW5lc3NPd25lciIsImRvY3VtZW50cyI6W10sImNyZWF0ZWRBdCI6IjIwMjQtMTAtMjlUMDQ6Mzg6NTkuODA5WiIsInVwZGF0ZWRBdCI6IjIwMjQtMTAtMjlUMDQ6Mzk6MzEuMzgzWiIsIl9fdiI6MH0sImlhdCI6MTczMDE3Njc3MSwiZXhwIjoxNzMwMTc3NjcxfQ.qFQcppL4RToBUagvmSSj68-RcLebR1aYNsZt2Rkxx08"
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

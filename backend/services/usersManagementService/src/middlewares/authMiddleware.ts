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
        const token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cGRhdGVkQ29tcGFueSI6eyJzdWJzY3JpcHRpb24iOnsicGxhbk5hbWUiOiJUcmlhbCIsInBsYW5UeXBlIjoiVHJpYWwiLCJzdGFydERhdGUiOiIyMDI0LTEwLTI4VDE4OjQ3OjI0LjkwOVoiLCJlbmREYXRlIjoiMjAyNC0xMS0wNFQxODo0NzoyNC45MDlaIiwic3RhdHVzIjoiQWN0aXZlIn0sIl9pZCI6IjY3MWZkYzIyNjI0YTI4Nzg2MjZiNGYzZiIsIm5hbWUiOiJvbW8iLCJlbWFpbCI6Im9tb0BnbWFpbC5jY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkVGx5MmdiUmpHOXBnUkIueVE5Z3VWLlcyWVI4dGhRdTVjRTJRLkg3bzhaSC5TQ0U1aHhOWi4iLCJhZGRyZXNzIjoibG9jYWwiLCJwaG9uZSI6Ijk4NzY3ODk4NzYiLCJ3ZWJzaXRlIjoiIiwicmVnaXN0cmF0aW9uTnVtYmVyIjoid2Zld3IzNCIsImlzVmVyaWZpZWQiOnRydWUsInJvbGUiOiJCdXNpbmVzc093bmVyIiwiZG9jdW1lbnRzIjpbXSwiY3JlYXRlZEF0IjoiMjAyNC0xMC0yOFQxODo0Njo1OC43MDBaIiwidXBkYXRlZEF0IjoiMjAyNC0xMC0yOFQxODo0NzoyNC45MTJaIiwiX192IjowfSwiaWF0IjoxNzMwMTQxMjQ1LCJleHAiOjE3MzAxNDIxNDV9.T_8g3Gz6mRSD8JN_a1yEL0Gxwj5mhdParSh2E5AUv74"
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

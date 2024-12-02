import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import connectDB from "../config/connectDB"; // Import connectDB function

// Extend the Request interface to include the user property
export interface CustomRequest extends Request {
  user?: JwtPayload & {
    managerData?: {
      _id: string;
      businessOwnerId: string;
    };
  };
}

const authenticateToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided" });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET; // Get the secret from environment variables
    if (!secret) {
      console.error("Access token secret is not defined");
      return res.status(500).json({ message: "Internal server error" }); // Return a 500 error if the secret is not defined
    }

    // Verify the token
    jwt.verify(
      token,
      secret,
      async (
        err: VerifyErrors | null,
        decoded: JwtPayload | string | undefined
      ) => {
        if (err) {
          console.error("Token verification failed:", err);
          return res.status(401).json({ message: "Invalid token" });
        }

        console.log(``.magenta + `Decoded token: ${JSON.stringify(decoded)}`);

        req.user = decoded as JwtPayload; // Attach the decoded user info to the request

        // Extract businessOwnerId from managerData
        const managerData = (req.user as JwtPayload).managerData;
        if (managerData && managerData.businessOwnerId) {
          const businessOwnerId = managerData.businessOwnerId;

          // Dynamically connect to the MongoDB database using businessOwnerId
          await connectDB(businessOwnerId); // Pass the businessOwnerId to the connectDB function
        } else {
          return res
            .status(401)
            .json({ message: "Business owner ID not found in manager data" });
        }

        next(); // Call the next middleware
      }
    );
  } catch (error) {
    console.error("Error in authenticateToken:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during authentication" });
  }
};

export default authenticateToken;

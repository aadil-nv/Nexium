import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import dotenv from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";

// Load environment variables
dotenv.config();

// Configure Multer storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle file uploads
export const uploadMiddleware = upload.single("file"); // Use 'file' as the field name

// AWS S3 Configuration
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error("AWS credentials are not set");
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// Function to generate a random file name
const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

// Function to upload files to S3
export const uploadToS3 = async (fileBuffer: Buffer, mimeType: string): Promise<string> => {
  try {
    const fileName = randomFileName(); // Generate a random file name

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType, // Use the MIME type dynamically
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command); // Upload file to S3
    return fileName;
  } catch (error) {
    console.error("Error while uploading file to S3: ", error);
    throw new Error("Error uploading file to S3");
  }
};

// Function to get a signed URL for retrieving files from S3
export const getSignedFileURL = async (fileName: string): Promise<string> => {
  try {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour
    return signedUrl;
  } catch (error) {
    console.error("Error while generating signed URL: ", error);
    throw new Error("Error generating signed URL");
  }
};

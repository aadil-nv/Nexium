import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import dotenv from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = upload.single("file"); 

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

const randomFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export const uploadToS3 = async (fileBuffer: Buffer, mimeType: string): Promise<string> => {
  try {
    const fileName = randomFileName();

    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType, 
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command); 
    return fileName;
  } catch (error) {
    console.error("Error while uploading file to S3: ", error);
    throw new Error("Error uploading file to S3");
  }
};

export const getSignedFileURL = async (fileName: string): Promise<string> => {
  try {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); 
    return signedUrl;
  } catch (error) {
    console.error("Error while generating signed URL: ", error);
    throw new Error("Error generating signed URL");
  }
};

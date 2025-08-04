import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import dotenv from "dotenv";
import { ObjectId } from "mongoose";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";



// Configure Multer storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });


export const uploadMiddleware = upload.single('file'); // Use 'file' as the field name

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

export const uploadTosS3 = async (fileBuffer: Buffer, mimeType: string): Promise<string> => {
 try {
        const fileName = randomFileName();

        const newMimeType = "image/jpeg";
        const uploadParams = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            contentType: newMimeType,
        };
    
        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);
        return fileName;
    } catch (error) {
        console.log("error while uploading image to s3: ", error);
        return "error";
    }
};

export const getSignedImageURL = async (image: string): Promise<string> => {
    const command = new GetObjectCommand({ Bucket: bucketName, Key: image });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
};
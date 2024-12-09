import mongoose, { Mongoose } from 'mongoose';
import 'colors';

export let dbInstance: Mongoose;
let isConnected = false;  // Flag to check if the DB is already connected

const connectDB = async (businessOwnerId: string): Promise<void> => {
   
        
    if (isConnected) {
        console.log('Already connected to the database');
        return;  // Skip reconnecting if already connected
    }

    try {
        const mongoUrl = process.env.MONGODB_URL; // Get the base URL from environment variables
        if (!mongoUrl) {
            throw new Error("MONGODB_URL not defined");
        }

        // Dynamically create the database URL with businessOwnerId
        const connectionString = `${mongoUrl}/${businessOwnerId}?retryWrites=true&w=majority&appName=Cluster0`;

        // Connect to the specific database dynamically
        dbInstance = await mongoose.connect(connectionString);
        isConnected = true; // Mark as connected
        console.log(`Database connected successfully for Business Owner ID: ${businessOwnerId}`.bgYellow.bold);
    } catch (error) {
        console.error("DB connection failed: ".red + error);
        process.exit(1);
    }
};

export default connectDB;

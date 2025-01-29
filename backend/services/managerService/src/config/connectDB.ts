import mongoose, { Mongoose } from 'mongoose';
import 'colors';

export let dbInstance: Mongoose;
const cachedConnections: Record<string, Mongoose> = {}; // Cache for database connections

const connectDB = async (businessOwnerId: string): Promise<void> => {
    const mongoUrl = process.env.MONGODB_URL; // Get the base URL from environment variables
    if (!mongoUrl) {
        throw new Error("MONGODB_URL not defined");
    }

    // Check if a connection for this business owner already exists
    if (cachedConnections[businessOwnerId]) {
        console.log(`Reusing cached connection for Business Owner ID: ${businessOwnerId}`);
        dbInstance = cachedConnections[businessOwnerId];
        return;
    }

    try {
        // Dynamically create the database URL with businessOwnerId
        const connectionString = `${mongoUrl}/${businessOwnerId}?retryWrites=true&w=majority&appName=Cluster0`;

        // Establish a new connection and cache it
        const connection = await mongoose.connect(connectionString);
        cachedConnections[businessOwnerId] = connection;
        dbInstance = connection;

        console.log(`Database connected successfully for Business Owner ID: ${businessOwnerId}`.bgYellow.bold);
    } catch (error) {
        console.error("DB connection failed: ".red + error);
        process.exit(1);
    }
};

export default connectDB;

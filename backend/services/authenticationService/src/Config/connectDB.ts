import mongoose, { Mongoose } from 'mongoose';
import 'colors';

export let dbInstance: Mongoose; // Mongoose type

const connectDB = async (): Promise<void> => {
    try {
        if (process.env.MONGODB_URL) {
            dbInstance = await mongoose.connect(process.env.MONGODB_URL);
            console.log(`Database connected successfully!`.bgYellow.bold);
        } else {
            throw new Error("MONGODB_URL not defined");
        }
    } catch (error) {
        console.error("DB connection failed: ".red + error);
        process.exit(1); // Exit the process if the DB connection fails
    }
};

export default connectDB;

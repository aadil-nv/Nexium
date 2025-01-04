import mongoose, { Mongoose } from 'mongoose';
import 'colors';

export let dbInstance: Mongoose;
let isConnected = false;  // Flag to check if the DB is already connected

const connectDB = async (employeeId: string): Promise<void> => {

    console.log();
    console.log();
    
    console.log("====================calling Connect db===================");
    console.log("====================employeeId==================",employeeId);
    
    console.log();
    console.log();

    if (isConnected) {
        console.log('Already connected to the database');
        return;  // Skip reconnecting if already connected
    }

    try {
        const mongoUrl = process.env.MONGODB_URL; // Get the base URL from environment variables
        console.log("11111111111111111111111111111111111111111111111111");
        
        
        if (!mongoUrl) {
            throw new Error("MONGODB_URL not defined");
        }
        console.log("1222222222222222222222222222222222222222222222222222");
     

        // Dynamically create the database URL with businessOwnerId
        const connectionString = `${mongoUrl}/${employeeId}?retryWrites=true&w=majority&appName=Cluster0`;
        console.log("333333333333333333333333333333333333333333333333333",connectionString);
        

        // Connect to the specific database dynamically
        dbInstance = await mongoose.connect(connectionString);
        console.log("44444444444444444444444444444444444444444444444444444444444444");
      
        isConnected = true; // Mark as connected
        console.log("55555555555555555555555555555555555555555555555555");
       
        console.log(`Database connected successfully `.bgYellow.bold);
    } catch (error) {
        console.log("66666666666666666666666666666666666666666666666666666666666666666");
   
        console.error("DB connection failed: ".red + error);
        process.exit(1);
    }
};

export default connectDB;
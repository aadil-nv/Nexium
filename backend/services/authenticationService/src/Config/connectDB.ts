import mongoose, { Mongoose } from "mongoose";
import 'colors' ;


export let dbInstance: Mongoose; // Mongoose type

export default async () => {
    try {
        if (process.env.MONGODB_URL) {
         
            dbInstance = await mongoose.connect(process.env.MONGODB_URL);
            console.log(`authService DB connected!`.bgYellow.bold);
           
        } else {
            throw new Error("MONGODB_URL not defined");
        }
    } catch (error) {
        console.log("DB connection failed: ".red + error);
    }
};

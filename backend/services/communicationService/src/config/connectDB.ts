import mongoose, { Connection } from 'mongoose';
import 'colors';

const cachedConnections: Record<string, Connection> = {}; // Cache for database connections

const connectDB = async (businessOwnerId: string): Promise<Connection> => {
    
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) throw new Error("MONGODB_URL not defined");

    if (cachedConnections[businessOwnerId]) {
        console.log(`Reusing cached connection for Employee ID: ${businessOwnerId}`);
        return cachedConnections[businessOwnerId];
    }

    try {
        const connectionString = `${mongoUrl}/${businessOwnerId}?retryWrites=true&w=majority`;
        const connection = mongoose.createConnection(connectionString);

        // Wait for connection to be ready before using it
        await new Promise<void>((resolve, reject) => {
            connection.once('open', () => {
                console.log(`Database connected for Employee ID: ${businessOwnerId}`.bgYellow.bold);
                resolve();
            });
            connection.on('error', reject);
        });

        cachedConnections[businessOwnerId] = connection;
        return connection;
    } catch (error) {
        console.error("DB connection failed: ", error);
        process.exit(1);
    }
};

export default connectDB;

// import mongoose, { Mongoose, Connection } from 'mongoose';
// import 'colors';
// import NodeCache from 'node-cache';

// // Types for connection cache
// interface CachedConnection {
//     connection: Mongoose;
//     lastAccessed: number;
// }

// interface ConnectionCache {
//     [key: string]: CachedConnection;
// }

// // Types for query cache
// interface QueryCacheConfig {
//     ttl: number;
//     checkPeriod: number;
//     maxKeys: number;
// }

// export let dbInstance: Mongoose;
// const connectionCache: ConnectionCache = {};
// const queryCache = new NodeCache({
//     stdTTL: 3600, // 1 hour default TTL
//     checkperiod: 600, // Check for expired items every 10 minutes
//     maxKeys: 1000 // Maximum number of cached queries
// });

// // Configuration for cache management
// const CACHE_CONFIG = {
//     connectionTimeout: 30 * 60 * 1000, // 30 minutes
//     maxConnections: 10,
//     queryCache: {
//         ttl: 3600,
//         checkPeriod: 600,
//         maxKeys: 1000
//     } as QueryCacheConfig
// };

// class DatabaseManager {
//     private static instance: DatabaseManager;
//     private cleanupInterval: NodeJS.Timeout;

//     private constructor() {
//         // Set up periodic cleanup of stale connections
//         this.cleanupInterval = setInterval(
//             () => this.cleanupStaleConnections(),
//             5 * 60 * 1000 // Run every 5 minutes
//         );
//     }

//     static getInstance(): DatabaseManager {
//         if (!DatabaseManager.instance) {
//             DatabaseManager.instance = new DatabaseManager();
//         }
//         return DatabaseManager.instance;
//     }

//     async connectDB(businessOwnerId: string): Promise<void> {
//         const mongoUrl = process.env.MONGODB_URL;
//         if (!mongoUrl) {
//             throw new Error("MONGODB_URL not defined");
//         }

//         // Check connection cache
//         if (this.isConnectionValid(businessOwnerId)) {
//             console.log(`Reusing cached connection for Business Owner ID: ${businessOwnerId}`.cyan);
//             dbInstance = connectionCache[businessOwnerId].connection;
//             connectionCache[businessOwnerId].lastAccessed = Date.now();
//             return;
//         }

//         // Clean up old connections if we're at the limit
//         if (Object.keys(connectionCache).length >= CACHE_CONFIG.maxConnections) {
//             this.cleanupStaleConnections();
//         }

//         try {
//             const connectionString = `${mongoUrl}/${businessOwnerId}?retryWrites=true&w=majority&appName=Cluster0`;
            
//             // Establish new connection with caching configuration
//             const connection = await mongoose.connect(connectionString, {
//                 bufferCommands: true,
//                 maxPoolSize: 10,
//                 minPoolSize: 5,
//                 serverSelectionTimeoutMS: 5000,
//                 socketTimeoutMS: 45000,
//                 family: 4
//             });

//             // Cache the new connection
//             connectionCache[businessOwnerId] = {
//                 connection,
//                 lastAccessed: Date.now()
//             };
            
//             dbInstance = connection;
//             console.log(`Database connected successfully for Business Owner ID: ${businessOwnerId}`.bgYellow.bold);

//             // Set up connection event handlers
//             connection.connection.on('error', this.handleConnectionError);
//             connection.connection.on('disconnected', () => this.handleDisconnect(businessOwnerId));

//         } catch (error) {
//             console.error("DB connection failed: ".red, error);
//             throw error;
//         }
//     }

//     // Query caching methods
//     async getCachedQuery<T>(key: string): Promise<T | undefined> {
//         return queryCache.get<T>(key);
//     }

//     async setCachedQuery<T>(key: string, data: T, ttl?: number): Promise<boolean> {
//         return queryCache.set(key, data, ttl || CACHE_CONFIG.queryCache.ttl);
//     }

//     async invalidateQueryCache(pattern: string): Promise<void> {
//         const keys = queryCache.keys();
//         const matchingKeys = keys.filter(key => key.includes(pattern));
//         queryCache.del(matchingKeys);
//     }

//     private isConnectionValid(businessOwnerId: string): boolean {
//         const cached = connectionCache[businessOwnerId];
//         if (!cached) return false;

//         const isStale = Date.now() - cached.lastAccessed > CACHE_CONFIG.connectionTimeout;
//         const isConnected = cached.connection.connection.readyState === 1;

//         return !isStale && isConnected;
//     }

//     private async cleanupStaleConnections(): Promise<void> {
//         const now = Date.now();
//         for (const [businessId, cached] of Object.entries(connectionCache)) {
//             if (now - cached.lastAccessed > CACHE_CONFIG.connectionTimeout) {
//                 await cached.connection.disconnect();
//                 delete connectionCache[businessId];
//                 console.log(`Cleaned up stale connection for Business Owner ID: ${businessId}`.yellow);
//             }
//         }
//     }

//     private handleConnectionError(error: Error): void {
//         console.error('MongoDB connection error:'.red, error);
//     }

//     private async handleDisconnect(businessOwnerId: string): Promise<void> {
//         delete connectionCache[businessOwnerId];
//         console.log(`Connection lost for Business Owner ID: ${businessOwnerId}`.red);
//     }

//     // Cleanup method for application shutdown
//     async cleanup(): Promise<void> {
//         clearInterval(this.cleanupInterval);
//         for (const cached of Object.values(connectionCache)) {
//             await cached.connection.disconnect();
//         }
//         queryCache.close();
//     }
// }

// // Export singleton instance
// export const databaseManager = DatabaseManager.getInstance();

// // Export connect function for backward compatibility
// const connectDB = async (businessOwnerId: string): Promise<void> => {
//     await databaseManager.connectDB(businessOwnerId);
// };

// export default connectDB;
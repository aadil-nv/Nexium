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














//!===================================

// import React, { useState } from 'react';
// import { useTheme } from '../landingPage/theme-provider';
// import { motion } from 'framer-motion';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { z } from 'zod';
// import { login, setBusinessOwnerData } from '../../../redux/slices/businessOwnerSlice';
// import { loginBusinessOwnerAPI } from '../../../api/authApi';

// // TypeScript interfaces
// interface LoginFormErrors {
//   email?: string;
//   password?: string;
// }

// interface LoginResponse {
//   success: boolean;
//   message?: string;
//   companyName?: string |undefined
//   profilePicture?: string | undefined;
//   companyLogo?: string | undefined;
//   isVerified?: boolean;
//   email?: string;
// }

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters long')
// });

// export default function LandingLoginPage(): JSX.Element {
//   const { theme } = useTheme();
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [errors, setErrors] = useState<LoginFormErrors>({});
//   const [credentialError, setCredentialError] = useState<string>('');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     const result = loginSchema.safeParse({ email, password });
//     if (!result.success) {
//       const formattedErrors = result.error.format();
//       setErrors({
//         email: formattedErrors.email?._errors[0],
//         password: formattedErrors.password?._errors[0],
//       });
//       return;
//     }

//     setErrors({});
//     setCredentialError('');

//     try {
//       const data: LoginResponse = await loginBusinessOwnerAPI(email, password);
      
//       if (data.success) {
//         dispatch(login({ role: 'businessOwner', isAuthenticated: true }));
//         dispatch(setBusinessOwnerData({
//           companyName: data.companyName || '', // Provide empty string as fallback
//       businessOwnerProfilePicture: data.profilePicture || '', // Provide empty string as fallback
//       companyLogo: data.companyLogo || '',
//         }));
//         navigate('/business-owner/dashboard');
//       } else {
//         if (data.message === "Account is blocked. Please contact admin") {
//           setCredentialError(data.message);
//         } else if (data.isVerified === false && data.email) {
//           navigate('/otp', { state: { email: data.email } });
//         } else {
//           setCredentialError(data.message || 'Invalid email or password');
//         }
//       }
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Something went wrong during login';
      
//       if (error.response?.data?.email && error.response?.data?.isVerified === false) {
//         navigate('/otp', { state: { email: error.response.data.email } });
//       } else {
//         setCredentialError(errorMessage);
//       }
//     }
//   };

//   const getInputStyle = (fieldError?: string): string => {
//     const baseStyle = `w-full px-4 py-3 rounded-lg transition duration-200 outline-none ${
//       theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'
//     }`;

//     if (fieldError) {
//       return `${baseStyle} border-2 border-red-500 focus:border-red-500`;
//     }

//     return `${baseStyle} border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500`;
//   };

//   return (
//     <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
//       {/* Left side - Image */}
//       <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
//         <img 
//           src="/api/placeholder/800/600"
//           alt="Login"
//           className="object-cover w-full h-full"
//         />
//         <div className="absolute inset-0 bg-blue-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
//           <div className="text-white text-center p-8">
//             <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
//             <p className="text-xl">Login to access your business dashboard</p>
//           </div>
//         </div>
//       </div>

//       {/* Right side - Login Form */}
//       <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
//         <motion.div
//           className="w-full max-w-md"
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="mb-10 text-center">
//             <h2 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
//               Sign In
//             </h2>
//             <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//               Please enter your credentials to continue
//             </p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-6">
//             <div>
//               <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
//                 Email Address
//               </label>
//               <input
//                 type="email"
//                 className={getInputStyle(errors.email)}
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
//             </div>

//             <div>
//               <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   className={getInputStyle(errors.password)}
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowPassword(prev => !prev)}
//                 >
//                   {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
//                 </button>
//               </div>
//               {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
//             </div>

//             {credentialError && (
//               <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
//                 {credentialError}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition duration-200 transform hover:scale-[1.02]"
//             >
//               Sign In
//             </button>

//             <div className="relative my-8">
//               <div className="absolute inset-0 flex items-center">
//                 <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className={`px-2 ${theme === 'dark' ? 'bg-black text-gray-400' : 'bg-white text-gray-500'}`}>
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             <div className="space-y-3">
//               <button
//                 type="button"
//                 className={`w-full flex items-center justify-center px-4 py-3 rounded-lg border transition duration-200 ${
//                   theme === 'dark' 
//                     ? 'border-gray-700 hover:bg-gray-800' 
//                     : 'border-gray-300 hover:bg-gray-50'
//                 }`}
//               >
//                 <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="w-5 h-5 mr-2" />
//                 <span className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Continue with Google</span>
//               </button>

//               <button
//                 type="button"
//                 className={`w-full flex items-center justify-center px-4 py-3 rounded-lg border transition duration-200 ${
//                   theme === 'dark' 
//                     ? 'border-gray-700 hover:bg-gray-800' 
//                     : 'border-gray-300 hover:bg-gray-50'
//                 }`}
//               >
//                 <img src="https://img.icons8.com/material-outlined/24/000000/github.png" alt="GitHub" className="w-5 h-5 mr-2" />
//                 <span className={theme === 'dark' ? 'text-white' : 'text-gray-700'}>Continue with GitHub</span>
//               </button>
//             </div>

//             <div className="text-center space-y-4 mt-8">
//               <a 
//                 href="/verify-email" 
//                 className={`text-sm hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
//               >
//                 Forgot your password?
//               </a>
//               <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                 Don't have an account?{' '}
//                 <a 
//                   href="/signup" 
//                   className={`font-medium hover:underline ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
//                 >
//                   Sign up for free
//                 </a>
//               </div>
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
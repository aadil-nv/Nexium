import { verifyRefreshToken } from "../../utils/jwt";
import IManagerRepository from "../../repository/interface/IManagerRepository";
import IManagerService from "../interface/IManagerService";
import { inject, injectable } from "inversify";
import mongoose from "mongoose";

@injectable()
export default class ManagerService implements IManagerService {
  constructor(
    @inject("IManagerRepository") private _managerRepository: IManagerRepository
  ) {}

  async connectDB(refreshToken: string): Promise<void> {
    try {
      const decodedData = verifyRefreshToken(refreshToken);
      console.log("decodedData", decodedData);
      
      const dataBaseId = decodedData?.result?.businessOwnerId;

      const mongoUrl = process.env.MONGODB_URL;
      if (!mongoUrl) {
        throw new Error("MONGODB_URL environment variable is not defined");
      }

      const connectionString = `mongodb+srv://adilev2000:xVRc7ZwDCpbZU1iA@cluster0.it4kv.mongodb.net/${dataBaseId}?retryWrites=true&w=majority&appName=Cluster0`;

      // Connect to the specific database dynamically
      await mongoose.connect(connectionString);
      console.log(`Connected to the database for ${dataBaseId}`);
    } catch (error) {
      console.error("Database connection error:", error);
      throw new Error("Database connection failed");
    }
  }

  async getManagers(): Promise<any> {
    try {
      return await this._managerRepository.findAll();
    } catch (error) {
      console.error("Error fetching managers:", error);
      throw new Error("Error fetching managers");
    }
  }
}

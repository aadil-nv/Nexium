import IManagerRepository from "../interface/IManagerReopsitory";
import ManagerModel from "../../models/managerModel";
import mongoose from "mongoose";
import { injectable } from "inversify";

@injectable()
export default class ManagerRepository implements IManagerRepository {
    
    async getAllManagers(businessOwnerId: string): Promise<any[]> {
        console.log(`hitting the repository for fetching get all managers=========`.bgMagenta);
        
        try {
            const switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
            const Manager = switchDb.model('Managers', ManagerModel.schema);
            const managers = await Manager.find(); 

            
            return managers; 
        } catch (error) {
            console.error("Error fetching managers:", error);   
            throw error
        }
    }

    async addManagers(businessOwnerId: string, managerData: any): Promise<any> {
        try {
            const switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
            const Manager = switchDb.model('Managers', ManagerModel.schema);
            const newManager = new Manager(managerData);
            const savedManager = await newManager.save();
            return savedManager;
        } catch (error) {
            console.error("Error adding  Manager from reppo----:", error);
            throw error
        }
    }
}
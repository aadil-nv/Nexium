// ManagerRepository.ts
import IManagerRepository from "../interface/IManagerReopsitory";
import managerModel from "../../models/managerModel";
import mongoose from "mongoose";
import { inject, injectable } from "inversify";
import BaseRepository from "./baseRepository";
import IManager from "entities/managerEntity";
import BusinessOwnerModel from "../../models/businessOwnerModel";
import {IBusinessOwnerDocument}  from "../interface/IBusinessOwnerModel";

@injectable()
export default class ManagerRepository extends BaseRepository<IManager> implements IManagerRepository {

    constructor (
        @inject("managerModel") private managerModel: mongoose.Model<IManager>
    ) {
        super(managerModel);  // Pass the model to the base repository constructor
    }
    
    async getAllManagers(businessOwnerId: string): Promise<IManager[]> {
        try {
            const switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
            const manager = switchDb.model<IManager>('Managers', managerModel.schema);
            const managers = await manager.find(); 
            return managers; 
        } catch (error) {
            console.error("Error fetching managers:", error);   
            throw error;
        }
    }

    async addManagers(businessOwnerId: string, managerData: IManager): Promise<IManager> {
        try {
            const switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
            const manager = switchDb.model<IManager>('Managers', managerModel.schema);
            const newManager = new manager(managerData);
            const savedManager = await newManager.save();
            return savedManager;
        } catch (error) {
            console.error("Error adding manager from repo:", error);
            throw error;
        }
    }

    async findById(id: string): Promise<IBusinessOwnerDocument> {
        try {
            const businessOwnerData = await BusinessOwnerModel.findById(id).exec();
        
            if (!businessOwnerData) {
                throw new Error(`BusinessOwner with ID ${id} not found`);
            }
    
            return businessOwnerData;  
            
        } catch (error) {
            console.error("Error finding manager by ID:", error);
            throw error;
        }
    }
}

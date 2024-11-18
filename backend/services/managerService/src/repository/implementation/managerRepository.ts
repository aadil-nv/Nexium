import { inject, injectable } from "inversify";
import IBaseRepository from "../interface/IBaseRepository";
import IManagerRepository from "../interface/IManagerRepository";
import IManager from "../../entities/managerEntities";
import BaseRepository from "../../repository/implementation/baseRepository";
import { Model } from "mongoose";
import managerModel from "../../models/managerModel";


@injectable()
export default class ManagerRepository extends BaseRepository<IManager> implements IManagerRepository{
    constructor(@inject("managerModel") managerModel: Model<IManager>) {
        super(managerModel);
    }

    async getManagers(): Promise<IManager[]> {
        try {   
            return await managerModel.find();  
        } catch (error) {
            console.log("Error finding documents:", error);
            return []; 
        }
    }

}
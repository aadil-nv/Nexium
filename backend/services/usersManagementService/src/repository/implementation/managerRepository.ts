import IManagerRepository from "../interface/IManagerReopsitory";
import ManagerModel from "../../models/managerSchema";
import mongoose from "mongoose";
import { injectable } from "inversify";

@injectable()
export default class ManagerRepository implements IManagerRepository {
    async getProfile(companyId: string, managerId: String): Promise<any> {
        const  switchDb = mongoose.connection.useDb(companyId,{useCache : true})
        const Mangers = switchDb.model("Mangers" ,ManagerModel.schema)
        const Manager =await Mangers.findById(managerId)
        return  Manager

    }
}
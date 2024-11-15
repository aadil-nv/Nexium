import { injectable, inject } from "inversify";
import managerModel from "../../model/managerModel";
import IManagerRepository from "../interfaces/IManagerRepository";
import IManager from "../../entities/managerEntities";    
import BaseRepository from "./baseRepository";

@injectable()
export default class ManagerRepository extends BaseRepository<IManager> implements IManagerRepository {
    constructor(
        @inject("managerModel") private managerModel: any  // Ensure "ManagerModel" matches the Inversify container binding
    ) {
        super(managerModel); // Pass the model to the base class constructor
    }

    async findByEmail(email: string): Promise<IManager | null> {
        try {
            // Searching for manager where the email is inside the managerCredentials object
            const manager = await this.managerModel.findOne({ 'managerCredentials.email': email });
            return manager;
        } catch (error) {
            console.error("Error logging in manager:", error);
            throw new Error("Manager login failed");
        }
    }
    
}

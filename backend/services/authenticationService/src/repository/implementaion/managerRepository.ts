import { injectable } from "inversify";
import managerSchema from "../../model/";
import IManagerRepository from "../interfaces/IManagerRepository";
import { IManagerDocument } from "../interfaces/IManagerRepository";    


@injectable()
export class ManagerRepository implements IManagerRepository {
    async login(email: string, password: string): Promise<IManagerDocument> {
        return managerSchema.findOne({ email, password });
    }
}
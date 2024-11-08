import { injectable } from "inversify";
import IManagerService from "../interfaces/IManagerService";
import { ITokenResponse } from "../interfaces/IBusinessOwnerService";
import { inject } from "inversify";
import  IManagerRepository  from "../../repository/interfaces/IManagerRepository";

@injectable()
export  default class ManagerService implements IManagerService {
    private managerRepository: IManagerRepository;

    constructor(@inject("IManagerRepository") managerRepository: IManagerRepository) {
        this.managerRepository = managerRepository;
    }

    async login (email:string ,password :string):Promise <Response> {
        
        try {
         const result = await this.managerRepository.login(email,password)
         return result            

        } catch (error) {
            console.log(error)
            return error
        } 
    }
}

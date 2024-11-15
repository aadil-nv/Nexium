import { injectable } from "inversify";
import IManagerService from "../interfaces/IManagerService";
import { ITokenResponse } from "../interfaces/IBusinessOwnerService";
import { inject } from "inversify";
import  IManagerRepository  from "../../repository/interfaces/IManagerRepository";
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from "../../utils/businessOwnerJWT";
@injectable()
export  default class ManagerService implements IManagerService {
    private managerRepository: IManagerRepository;

    constructor(@inject("IManagerRepository") managerRepository: IManagerRepository) {
        this.managerRepository = managerRepository;
    }

  

    async managerLogin(email: string, password: string): Promise<any> {
        try {
          if (!email || !password) throw new Error('Email and password are required');
      
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
      
          if (!emailRegex.test(email)) throw new Error('Invalid email format');
          if (!passwordRegex.test(password)) throw new Error('Password must be at least 6 characters, 1 uppercase, 1 digit, 1 symbol');
      
          const result = await this.managerRepository.findByEmail(email);
          if (!result || result.managerCredentials.password !== password) throw new Error('Invalid email or password');

          const accessToken = generateAccessToken({ result });
          const refreshToken = generateRefreshToken({ result });

      
          return { id: result.id, email: result.email, name: result.name ,accessToken:accessToken, refreshToken:refreshToken };
        } catch (error) {
          console.error('Error in managerLogin:', error);
          throw error; // Re-throw to maintain existing error handling
        }
      }
      
    
    
    
    
    

    

    addManager(data: any): Promise<any> {
        console.log(`Adding manager with data: `.bgWhite, data);
        
        try {
            return this.managerRepository.create(data);
        } catch (error) {
            console.log(error);
            return Promise.resolve(error); // Return a resolved promise with undefined
        }
    }
    
}

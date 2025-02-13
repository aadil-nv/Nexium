import {IManager} from "entities/managerEntities";
import BaseRepository from "../../repository/implementaion/baseRepository";
import { ObjectId } from "mongoose";

export default interface IManagerService extends BaseRepository<IManager> {
    findByEmail(email: string): Promise<IManager | null>;
    findByCredentialEmail(email: string): Promise<IManager | null>;
    findOtpByEmail(email: string): Promise<any | null>;
    updateVerificationStatus(email: string , businessOwnerId :ObjectId): Promise<any>;
    updateOtp(email: string, otp: string): Promise<IUpdateOtpResult>;
    blockManager( managerData: any): Promise<any>;
    updateManager(managerId: any, managerData: any): Promise<any>
    updateIsActive (id: any, isActive: boolean): Promise<IManager | null>
}

export interface IUpdateOtpResult {
    success: boolean;
    message: string;
  }
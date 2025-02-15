import BaseRepository from "../../repository/implementaion/baseRepository";

import  IEmployeeDocument from "../../entities/employeeEntities";
import { ObjectId } from "mongoose";

export default interface IEmployeeRepository extends BaseRepository<IEmployeeDocument> {
    findByCredentialEmail(email: string, password: string): Promise<IEmployeeDocument>
    findOtpByEmail(email: string): Promise<any | null> 
    updateVerificationStatus(email: string ,businessOwnerId: ObjectId): Promise<any>
    findByEmail(email: string): Promise<IEmployeeDocument | null>
    updateOtp(email: string, otp: string): Promise<void>
     updateIsActive(bsuinessOwnerId:string ,id: any, isActive: boolean): Promise<IEmployeeDocument | null>
}
import {IManager} from "entities/managerEntities";
import BaseRepository from "../../repository/implementaion/baseRepository";

export default interface IManagerService extends BaseRepository<IManager> {
    findByEmail(email: string): Promise<IManager | null>;
    findByCredentialEmail(email: string): Promise<IManager | null>;
    findOtpByEmail(email: string): Promise<any | null>;
    updateVerificationStatus(email: string): Promise<any>;
}
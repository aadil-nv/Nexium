import IManager from "entities/managerEntities";
import BaseRepository from "../../repository/implementaion/baseRepository";

export default interface IManagerService extends BaseRepository<IManager> {
    findByEmail(email: string): Promise<IManager | null>;
}
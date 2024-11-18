import IManager from "../../entities/managerEntities";
import BaseRepository from "../implementation/baseRepository";

export default interface IManagerRepository extends BaseRepository<IManager>  {
    getManagers(): Promise<IManager[]>
}
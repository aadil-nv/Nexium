import IManager from "entities/managerEntity";
export default interface IBusinessOwnerRepository {
    registerBusinessOwner(businessOwnerData: string): Promise<any>
}
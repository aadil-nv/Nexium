import IManager from "entities/managerEntity";
export default interface IBusinessOwnerRepository {
    addManagers(companyId: string, hrManagerData: IManager): Promise<IManager>;
    findAllManagers(companyId: string): Promise<any[]>
    registerBusinessOwner(businessOwnerData: string): Promise<any>
}
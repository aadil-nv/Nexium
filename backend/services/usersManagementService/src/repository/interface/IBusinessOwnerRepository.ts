import IManager from "entities/managerEntity";
export default interface IBusinessOwnerRepository {
    addManagers(companyId: string, hrManagerData: IManager): Promise<IManager>;
    findAllCompanies(): Promise<any[]>
}
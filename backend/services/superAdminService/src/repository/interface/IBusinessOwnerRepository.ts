export default interface IBusinessOwnerService {
    fetchAllBusinessOwners(): Promise<any>;
    registerBusinessOwner(businessOwnerData:string): Promise<any>;
}
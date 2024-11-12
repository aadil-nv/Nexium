export default interface IBusinessOwnerService {
    fetchAllBusinessOwners(): Promise<any>;
    registerBusinessOwner(businessOwnerData:string): Promise<any>;
    updateIsBlocked(id:string): Promise<any>;
    setNewAccessToken(refreshToken: string): Promise<string>
}
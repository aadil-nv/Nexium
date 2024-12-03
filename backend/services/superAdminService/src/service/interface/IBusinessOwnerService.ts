export default interface IBusinessOwnerService {
    fetchAllBusinessOwners(): Promise<any>;
    updateIsBlocked(id:string): Promise<any>;
    setNewAccessToken(refreshToken: string): Promise<string>
}
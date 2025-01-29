

export default interface ISuperAdminService {
    setNewAccessToken(refreshToken: string): Promise<string>;
    getAllServiceRequest(): Promise<any>;
    updateServiceRequestStatus(id: string, status: string): Promise<any>;
}
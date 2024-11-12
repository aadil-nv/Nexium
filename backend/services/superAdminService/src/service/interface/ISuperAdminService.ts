

export default interface ISuperAdminService {
    setNewAccessToken(refreshToken: string): Promise<string>;
}
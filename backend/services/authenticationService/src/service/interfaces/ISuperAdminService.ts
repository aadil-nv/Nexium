
import { IExtendedLoginResponse } from "../../dto/superAdminDTO";
import { ISuperAdmin } from "../../entities/superAdminEntities";

export default interface ISuperAdminService {
  login(email: string, password: string): Promise<IExtendedLoginResponse>;
  register(username: string, email: string, password: string): Promise<Omit<ISuperAdmin, "password">>;
  setNewAccessToken(refreshToken: string): Promise<string>;
  
}
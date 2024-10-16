import { ICompanyDocument } from "../../entities/ICompany";

export interface ICompany extends ICompanyDocument {
  password: string;
  otp: string;
}

export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}


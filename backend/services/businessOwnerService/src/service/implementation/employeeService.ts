import IEmployeeService from "../interface/IEmployeeService";
import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import { inject, injectable } from "inversify";
import { IEmployeeDTO } from "dto/employeeDTO";
import IManagerRepository from "repository/interface/IManagerReopsitory";
import { generateUAN } from "../../utils/generateUAN";
import { generatePFAccountNumber } from "../../utils/generatePFAccountNumber";
import { generateESICAccountNumber } from "../../utils/generateESICAccountNumber";
import { generatePassword } from "../../utils/generatePassword";
import { generateEmail } from "../../utils/generateEmail";
import { generateOfferLetter } from "../../utils/generateOfferLetter copy";
import nodemailer from "nodemailer";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedImageURL, uploadTosS3 } from "../../middlewares/multer-s3";
import { IEmployeeLeave } from "../../entities/employeeLeaveEntities";


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
@injectable()   
export default class EmployeeService implements IEmployeeService {

  private _employeeRepository: IEmployeeRepository;
  private _managerRepository: IManagerRepository

  constructor(@inject("IEmployeeRepository") employeeRepository: IEmployeeRepository , @inject("IManagerRepository") managerRepository:IManagerRepository) {
    this._employeeRepository = employeeRepository;
    this._managerRepository = managerRepository;
  }

  async getProfile(employeeId: string, businessOwnerId: string): Promise<void> {
    try {
      await this._employeeRepository.getProfile(employeeId, businessOwnerId);
    } catch (error) {
      throw new Error("Error adding attendance: " + error);
    }
  }

  async getAllEmployees(businessOwnerId: string): Promise<IEmployeeDTO[]> {
    try {
      const employees = await this._employeeRepository.getAllEmployees(businessOwnerId);
      const employeeLeaves = await this._employeeRepository.getEmployeeLeave(businessOwnerId);
  
      return employees.map((employee): IEmployeeDTO => {
        const leaveData = employeeLeaves.find((leave:IEmployeeLeave) => String(leave.employeeId) === String(employee._id)) || {};
  
        return {
          _id: String(employee._id),
          managerId: employee.managerId ? String(employee.managerId) : "",
          businessOwnerId: employee.businessOwnerId ? String(employee.businessOwnerId) : "",
          personalDetails: {
            employeeName: employee.personalDetails.employeeName,
            email: employee.personalDetails.email,
            phone: employee.personalDetails.phone,
            profilePicture: employee.personalDetails.profilePicture
              ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}`
              : "",
            personalWebsite: employee.personalDetails.personalWebsite,
            bankAccountNumber: employee.personalDetails.bankAccountNumber,
            ifscCode: employee.personalDetails.ifscCode,
            aadharNumber: employee.personalDetails.aadharNumber,
            panNumber: employee.personalDetails.panNumber,
            gender: employee.personalDetails.gender,
          },
          address: {
            street: employee.address.street as string,
            city: employee.address.city as string,
            state: employee.address.state as string,
            country: employee.address.country as string,
            postalCode: employee.address.postalCode as string,
          },
          professionalDetails: {
            position: employee.professionalDetails.position,
            workTime: employee.professionalDetails.workTime,
            department: employee.professionalDetails.department,
            joiningDate: employee.professionalDetails.joiningDate,
            currentStatus: employee.professionalDetails.currentStatus,
            salary: employee.professionalDetails.salary,
            uanNumber: employee.professionalDetails.uanNumber,
            pfAccount: employee.professionalDetails.pfAccount,
            esiAccount: employee.professionalDetails.esiAccount,
          },
          employeeCredentials: {
            companyEmail: employee.employeeCredentials.companyEmail,
            companyPassword: employee.employeeCredentials.companyPassword,
          },
          isActive: employee.isActive,
          isBlocked: employee.isBlocked,
          employeeLeaves: {
            sickLeave: leaveData.sickLeave || 0,
            casualLeave: leaveData.casualLeave || 0,
            maternityLeave: leaveData.maternityLeave || 0,
            paternityLeave: leaveData.paternityLeave || 0,
            paidLeave: leaveData.paidLeave || 0,
            unpaidLeave: leaveData.unpaidLeave || 0,
            compensatoryLeave: leaveData.compensatoryLeave || 0,
            bereavementLeave: leaveData.bereavementLeave || 0,
            marriageLeave: leaveData.marriageLeave || 0,
            studyLeave: leaveData.studyLeave || 0,
          },
        };
      });
    } catch (error) {
      console.error("Error retrieving employees:", error);
      throw new Error("Error retrieving employees: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  }

  async addEmployee(employeeData: any, businessOwnerId: string): Promise<any> {
    try {
        const companyData = await this._employeeRepository.getBusinessOwnerData(businessOwnerId);
        const existingEmail = await this._employeeRepository.findByEmail(employeeData.personalDetails.email, businessOwnerId);
        
        if (existingEmail) {
            throw new Error("Email already exists");
        }
    
                const newEmployeeData: any = {
             businessOwnerId: businessOwnerId,
            isActive: false,
            isBlocked: false,
            personalDetails: {
                employeeName: employeeData.personalDetails.employeeName,
                email: employeeData.personalDetails.email,
                phone: employeeData.personalDetails.phone,
            },
            professionalDetails: {
                salary: employeeData.professionalDetails.salary,
                workTime: employeeData.professionalDetails.workTime,
                position: employeeData.professionalDetails.position,
                department: null,
                currentStatus: "Active",
                joiningDate: employeeData.professionalDetails.joiningDate,
                companyName: companyData.companyDetails.companyName,
                uanNumber: generateUAN(),
                pfAccount: generatePFAccountNumber(),
                esiAccount: generateESICAccountNumber(),
            },
            employeeCredentials: {
                companyEmail: generateEmail(companyData.companyDetails.companyName, employeeData.personalDetails.employeeName, businessOwnerId),
                companyPassword: generatePassword(companyData.companyDetails.companyName, employeeData.personalDetails.employeeName, businessOwnerId),
            },
        };

        const addedEmployee = await this._employeeRepository.addEmployee(newEmployeeData, businessOwnerId);

        // Send offer letter
        await this.sendOfferLetter(companyData, newEmployeeData);

        return addedEmployee;

    } catch (error) {
        throw new Error("Error adding employee: " + error);
    }
}

   async sendOfferLetter(businessOwnerData: any, mappedEmployeeData: any) {
    try {
      const offerLetterContent = generateOfferLetter(businessOwnerData.personalDetails.businessOwnerName, mappedEmployeeData);

      const mailOptions = {
        from: businessOwnerData.personalDetails.email,
        to: mappedEmployeeData.personalDetails.email,
        subject: `Offer Letter for ${businessOwnerData.companyDetails.companyName} Mr.${mappedEmployeeData.personalDetails.name}`,
        html: offerLetterContent,
      };

      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending offer letter:", error);
      throw new Error("Failed to send offer letter. Please try again later.");
    }
  }

  async removeEmployee(employeeId: string, businessOwnerId: string): Promise<any> {
    try {
      return await this._employeeRepository.removeEmployee(employeeId, businessOwnerId);
    } catch (error) {
      throw new Error("Error removing employee: " + error);
    }
  }

  async blockEmployee(employeeId: string, businessOwnerId: string): Promise<any> {
    try {
      return await this._employeeRepository.blockEmployee(employeeId, businessOwnerId);
    } catch (error) {
      throw new Error("Error blocking employee: " + error);
    }
  }


  async updateProfessionalInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any> {
    try {
      return await this._employeeRepository.updateProfessionalInfo(employeeId, businessOwnerId, data);
    } catch (error) {
      throw new Error("Error updating professional info: " + error);
    }
  }


  async updateAddressInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any> {
    try {
      return await this._employeeRepository.updateAddressInfo(employeeId, businessOwnerId, data);
    } catch (error) {
      throw new Error("Error updating address info: " + error);
    }
  }

  async updateSecurityInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any> {
    try {
      return await this._employeeRepository.updateSecurityInfo(employeeId, businessOwnerId, data);
    } catch (error) {
      throw new Error("Error updating security info: " + error);
    }
  }

  async updatePersonalInfo(employeeId: string, businessOwnerId: string, data: any): Promise<IEmployeeDTO> {
    try {
      return await this._employeeRepository.updatePersonalInfo(employeeId, businessOwnerId, data);
    } catch (error) {
      throw new Error("Error updating personal info: " + error);
    }
  }

  async uploadProfilePic(businessOwnerId:string ,employeeId:string, file:any):Promise<any>{
    try {
      const imageUrl= await this.uploadFileToS3(businessOwnerId,employeeId, file , "profilePicture");
      const result =  await this._employeeRepository.uploadProfilePic(employeeId ,businessOwnerId, imageUrl);
      const prfilePicture = getSignedImageURL(result.personalDetails.profilePicture)       
      return prfilePicture 
    } catch (error) {
      throw new Error("Error updating personal info: " + error);
    }
  }

    private async uploadFileToS3(businessOwnerId: string,employeeId: string,file: Express.Multer.File,fileType: "profilePicture") {
      const result:any  = await this._employeeRepository.getProfile(employeeId, businessOwnerId);

if (!result) {
  throw new Error("Profile not found");
}

if (!result.personalDetails) {
  throw new Error("Personal details not found");
}

const existingFile = result.personalDetails.profilePicture;
        
    
      if (existingFile) {
        const s3Client = new S3Client({ region: 'eu-north-1' });
    
        let existingFileKey: string | undefined;
    
        if (typeof existingFile === "string") {
          existingFileKey = existingFile; 
        } else if (typeof existingFile === "object") {
          existingFileKey = (existingFile as any).fileName || (existingFile as any).url || undefined;
        }
    
        if (existingFileKey) {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: existingFileKey,
            })
          );
        }
      }
    
      const fileUrl = await uploadTosS3(file.buffer, file.mimetype);    
      return fileUrl;
    }



    async updateEmployeeLeaveInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any> {
      try {
        return await this._employeeRepository.updateEmployeeLeaveInfo(employeeId, businessOwnerId, data);
      } catch (error) {
        throw new Error("Error updating employee leave info: " + error);
      }
    } 

}

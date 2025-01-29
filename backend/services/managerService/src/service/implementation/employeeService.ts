import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import { inject, injectable } from "inversify";
import IEmployeeService from "../interface/IEmployeeService";
import { generateEmail } from "../../utils/generateEmail";
import { generatePassword } from "../../utils/generatePassword";
import nodemailer from "nodemailer";
import { generateOfferLetter } from "../../utils/generateOfferLetter";
import { IEmployeeAddressDTO, IEmployeeCredentialsDTO, IEmployeeDocumentsDTO,
   IEmployeePersonalInformationDTO, IEmployeeProfessionalInfoDTO, IEmployeesDTO ,IEmployeeFullDataDTO } from "../../dto/IEmployeesDTO";
import RabbitMQMessager from "../../events/implementation/producer";
import IEmployee from "../../entities/employeeEntities";
import { uploadTosS3 } from "../../middlewares/multer-s3";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { generateUAN } from "../../utils/generateUAN";
import { generatePFAccountNumber } from "../../utils/generatePFAccountNumber";
import { generateESICAccountNumber } from "../../utils/generateESICAccountNumber";
import { IEmployeeAttendance } from "../../entities/attendanceEntities";
import ILeaveRepository from "repository/interface/ILeaveRepository";



const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

@injectable()
export default class EmployeeService implements IEmployeeService {
  constructor(
    @inject("IEmployeeRepository") 
    private _employeeRepository: IEmployeeRepository,
    @inject("ILeaveRepository")
    private _leaveRepository: ILeaveRepository

  ) {}

  async addEmployees(employeeData: any, managerData: any): Promise<any> {
    const rabbitMQMessager = new RabbitMQMessager();
    await rabbitMQMessager.init();   

    try {
        const managerId = managerData._id


        if (!managerId) {
            return { success: false, message: "Invalid manager ID." };
        }

        const existingEmail = await this._employeeRepository.findByEmail(employeeData.email);
        if (existingEmail) {
            return { success: false, message: "Email already exists" };
        }

        const validationResult = this.validateEmployeeData(employeeData);
        if (!validationResult.success) {
            return { success: false, message: validationResult.message };
        }

        const mappedEmployeeData = this.mapEmployeeData(managerId, employeeData);

        const managerName = managerData.name;
        
        mappedEmployeeData.businessOwnerId = managerData.businessOwnerId;

        mappedEmployeeData.personalDetails.employeeName = employeeData.name;

        mappedEmployeeData.personalDetails.personalWebsite = ''
        mappedEmployeeData.professionalDetails.salary = employeeData.salary;
        mappedEmployeeData.professionalDetails.workTime = employeeData.workTime;
        mappedEmployeeData.professionalDetails.joiningDate = employeeData.joiningDate;
        mappedEmployeeData.professionalDetails.department = null;
        mappedEmployeeData.professionalDetails.position = employeeData.position;
        mappedEmployeeData.professionalDetails.companyName = managerData.companyDetails.companyName;
        mappedEmployeeData.professionalDetails.uanNumber = generateUAN();
        mappedEmployeeData.professionalDetails.pfAccount = generatePFAccountNumber();
        mappedEmployeeData.professionalDetails.esiAccount = generateESICAccountNumber();
        

        const email = generateEmail(mappedEmployeeData.professionalDetails.companyName, employeeData.name, managerId);

        const password = generatePassword(mappedEmployeeData.professionalDetails.companyName, employeeData.name, managerId);

        mappedEmployeeData.employeeCredentials.companyEmail = email;
        mappedEmployeeData.employeeCredentials.companyPassword = password;


        const addedEmployee = await this._employeeRepository.addEmployee(mappedEmployeeData); // Renamed variable
        await rabbitMQMessager.sendToMultipleQueues({ employeeData: addedEmployee });
        return { success: true, data: addedEmployee }; // Renamed variable
        await this.sendOfferLetter(managerName, mappedEmployeeData);
    } catch (error: any) {
        console.error("Error in addEmployees service:", error.message);
        return { success: false, message: "Failed to add employee" };
    }
}

  private validateEmployeeData(employeeData: any): { success: boolean; message: string } {
    if (!employeeData.name || employeeData.name.trim().length < 3) {
      return { success: false, message: "Employee name must be at least 3 characters long" };
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!employeeData.email || !emailRegex.test(employeeData.email)) {
      return { success: false, message: "Invalid email address" };
    }

    if (
      !employeeData.phoneNumber ||
      employeeData.phoneNumber.length !== 10 ||
      !/^\d+$/.test(employeeData.phoneNumber)
    ) {
      return { success: false, message: "Phone number must be exactly 10 digits" };
    }

    if (!employeeData.position) {
      return { success: false, message: "Position is required" };
    }

    if (!employeeData.workTime) {
      return { success: false, message: "Work time is required" };
    }

 

    return { success: true, message: "" };
  }

  private mapEmployeeData(managerId: string, employeeData: any): any {
    return {
      managerId,
      name: employeeData.name,
      personalDetails: {
        firstName: employeeData.name.split(" ")[0] || "",
        lastName: employeeData.name.split(" ")[1] || "",
        email: employeeData.email,
        phone: employeeData.phoneNumber,
        street: "",
        city: "",
        state: "",
        postalCode: "",
      },
      professionalDetails: {
        position: employeeData.position,
        workTime: employeeData.workTime,
        department: employeeData.department,
        joiningDate: new Date(),
        currentStatus: "Active",
      },
      employeeCredentials: {
        companyEmail: employeeData.email,
        companyPassword: "",
      },

    };
  }

  async  sendOfferLetter(managerName: string, mappedEmployeeData: any) {
    try {
      const offerLetterContent = generateOfferLetter(managerName, mappedEmployeeData);

      const mailOptions = {
        from: 'your-email@gmail.com',
        to: mappedEmployeeData.personalDetails.email,
        subject: `Offer Letter for ${mappedEmployeeData.professionalDetails.companyName} Manager`,
        html: offerLetterContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Offer letter sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending offer letter:", error);
      throw new Error("Failed to send offer letter. Please try again later.");
    }
  }

  async getEmployees(): Promise<IEmployeesDTO[]> {
    try {
        const employeesData = await this._employeeRepository.findAll();

        // Map the repository data to the DTO structure
        const employeesDTO: IEmployeesDTO[] = employeesData.map((employee) => ({
            employeeName: employee.personalDetails.employeeName, // Assuming `name` is the field in the repository data
            position: employee.professionalDetails.position,
            isActive: employee.isActive,
            profilePicture: employee.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}` : employee.personalDetails.profilePicture, // Provide a fallback for optional fields
            email: employee.personalDetails.email,
            _id: employee._id,
            isBlocked: employee.isBlocked
        }));

        return employeesDTO;
    } catch (error) {
        console.error("Error in service layer:", error);
        throw new Error("Failed to fetch employees data");
    }
}

async updateEmployeePersonalInformation(employeeId: string ,personalInformation: any) : Promise<IEmployeePersonalInformationDTO> {
    try {
        const employeeData = await this._employeeRepository.updateEmployeePersonalInformation(employeeId ,personalInformation);

        if (!employeeData) {
            throw new Error("Employee not found");
        }

       return {
           employeeName: employeeData.personalDetails.employeeName,
           phone: employeeData.personalDetails.phone,
           profilePicture: employeeData.personalDetails.profilePicture || "",
           email: employeeData.personalDetails.email
       }
    } catch (error) {
        console.error("Error in service layer:", error);
        throw new Error("Failed to fetch employee information");
    }
  }

  async updateAddress(employeeId: string ,address: any): Promise<IEmployeeAddressDTO> {
    try {
        const employeeData = await this._employeeRepository.updateAddress(employeeId ,address);

        if (!employeeData) {
            throw new Error("Employee not found");
        }

        return {
            street: employeeData.personalDetails.street,
            city: employeeData.personalDetails.city,
            state: employeeData.personalDetails.state,
            postalCode: employeeData.personalDetails.postalCode,
            country: employeeData.personalDetails.country
        }
    } catch (error) {
        console.error("Error in service layer:", error);
        throw new Error("Failed to fetch employee address");
    }
   }

   async updateEmployeeProfessionalInfo(employeeId: string, professionalInfo: any): Promise<IEmployeeProfessionalInfoDTO> {
    try {
        // Check if department is not added, then set it as null
        if (!professionalInfo.department || professionalInfo.department === 'Not added') {
            professionalInfo.department = null;  // Assign null if department is not added
        }

        // Update employee professional information
        const employeeData = await this._employeeRepository.updateEmployeeProfessionalInfo(employeeId, professionalInfo);

        if (!employeeData) {
            throw new Error("Employee not found");
        }

        // Retrieve department name after update
        const departmentName = await this._employeeRepository.getDepartmentName(employeeData.professionalDetails.department);
        console.log("******************departmentName************", departmentName);

        // Return the updated professional information
        return {
            position: employeeData.professionalDetails.position,
            workTime: employeeData.professionalDetails.workTime,
            department: departmentName || '',  // If departmentName is null, return an empty string
            joiningDate: employeeData.professionalDetails.joiningDate,
            currentStatus: employeeData.professionalDetails.currentStatus,
            companyName: employeeData.professionalDetails.companyName,
            salary: employeeData.professionalDetails.salary,
            skills: employeeData.professionalDetails.skills,
        };
    } catch (error) {
        console.error("Error in service layer:", error);
        throw new Error("Failed to fetch employee professional information");
    }
}

   
     async getEmployeeCredentials(employeeId: string): Promise<IEmployeeCredentialsDTO> {
        try {
            const employeeData = await this._employeeRepository.getEmployeeInformation(employeeId);
    
            if (!employeeData) {
                throw new Error("Employee not found");
            }
    
            return {
                companyEmail: employeeData.employeeCredentials.companyEmail,
                companyPassword: employeeData.employeeCredentials.companyPassword
            }
        } catch (error) {
            console.error("Error in service layer:", error);
            throw new Error("Failed to fetch employee credentials");
        }
     }

     async getEmployeeDocuments(employeeId: string): Promise<IEmployeeDocumentsDTO> {
        try {
            const employeeData = await this._employeeRepository.getEmployeeInformation(employeeId);
    
            if (!employeeData) {
                throw new Error("Employee not found");
            }
    
            return {
              resume: {
                documentName: employeeData.document.resume.documentName,
                documentUrl: employeeData.document.resume.documentUrl,
                documentSize: employeeData.document.resume.documentSize,
                uploadedAt: employeeData.document.resume.uploadedAt,
              },
              
            };
        } catch (error) {
            console.error("Error in service layer:", error);
            throw new Error("Failed to fetch employee employeeData");
        }
     }

     async getEmployee(employeeId: string): Promise<IEmployeeFullDataDTO> {

      try {
          const employeeData = await this._employeeRepository.getEmployeeInformation(employeeId);
          const leaveData = await this._leaveRepository.getEmployeeLeaves(employeeId);
  
          if (!employeeData) {
              throw new Error("Employee not found");
          }
  
          let departmentName: string | null = await this._employeeRepository.getDepartmentName(employeeData.professionalDetails.department);
        

  
          if (!departmentName) {
              departmentName = null;
          }

  
          return {
              _id: employeeData._id.toString(),
              managerId: employeeData.managerId?.toString() || '',
              businessOwnerId: employeeData.businessOwnerId?.toString() || '',
              isActive: employeeData.isActive,
              isVerified: employeeData.isVerified,
              isBlocked: employeeData.isBlocked,
  
              personalDetails: {
                  employeeName: employeeData.personalDetails.employeeName,
                  email: employeeData.personalDetails.email,
                  phone: employeeData.personalDetails.phone,
                  profilePicture: employeeData.personalDetails.profilePicture ?  `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employeeData.personalDetails.profilePicture}` :employeeData.personalDetails.profilePicture,
                  personalWebsite: employeeData.personalDetails.personalWebsite,
                  bankAccountNumber: employeeData.personalDetails.bankAccountNumber,
                  ifscCode: employeeData.personalDetails.ifscCode,
                  aadharNumber: employeeData.personalDetails.aadharNumber,
                  panNumber: employeeData.personalDetails.panNumber,
                  gender: employeeData.personalDetails.gender,


              },
  
              address: {
                  street: employeeData.address.street,
                  city: employeeData.address.city,
                  state: employeeData.address.state,
                  country: employeeData.address.country,
                  postalCode: employeeData.address.postalCode,
              },
  
              professionalDetails: {
                  position: employeeData.professionalDetails.position,
                  department: departmentName,  // Now allows null
                  workTime: employeeData.professionalDetails.workTime,
                  joiningDate: employeeData.professionalDetails.joiningDate,
                  currentStatus: employeeData.professionalDetails.currentStatus,
                  companyName: employeeData.professionalDetails.companyName,
                  salary: employeeData.professionalDetails.salary,
                  uanNumber: employeeData.professionalDetails.uanNumber,
                  pfAccount: employeeData.professionalDetails.pfAccount,
                  esiAccount: employeeData.professionalDetails.esiAccount,
                  comapanyLogo: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employeeData.professionalDetails.comapanyLogo}`,
              },
  
              employeeCredentials: {
                  companyEmail: employeeData.employeeCredentials.companyEmail,
                  companyPassword: employeeData.employeeCredentials.companyPassword,
              },
  
              documents: {
                  resume: {
                      documentName: employeeData.documents.resume.documentName,
                      documentUrl: employeeData.documents.resume.documentUrl ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employeeData.documents.resume.documentUrl}` : '',
                      documentSize: employeeData.documents.resume.documentSize,
                      uploadedAt: employeeData.documents.resume.uploadedAt,
                  },
              },

              leaves :{
                sickLeave: leaveData.sickLeave,
                casualLeave: leaveData.sickLeave,
                maternityLeave: leaveData.sickLeave,
                paternityLeave: leaveData.sickLeave,
                paidLeave: leaveData.sickLeave,
                unpaidLeave: leaveData.sickLeave,
                compensatoryLeave: leaveData.sickLeave,
                bereavementLeave: leaveData.sickLeave,
                marriageLeave: leaveData.sickLeave,
                studyLeave: leaveData.sickLeave,
              }
  
             
          };
  
      } catch (error) {
          console.error("Error in service layer:", error);
          throw new Error("Failed to fetch employee information");
      }
  }

  async updateProfilePicture(employeeId: string ,file: Express.Multer.File): Promise<any> {
    try {
      const imageUrl = await this.uploadFileToS3(employeeId, file, "profilePicture");

       const result = await this._employeeRepository.updateProfilePicture(employeeId, imageUrl);
       return { success: true, message: 'Image uploaded successfully!', data: { imageUrl:`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${result}` } };
    } catch (error) {
        console.error("Error in service layer:", error);
        throw new Error("Failed to update profile picture");
    }
  }

  private async uploadFileToS3(employeeId: string, file: Express.Multer.File, fileType: "profilePicture" | "resume" | "idProof"): Promise<string> {

    const result = await this._employeeRepository.getEmployeeInformation(employeeId);

    const existingFile = fileType === "profilePicture"
        ? result.personalDetails.profilePicture 
        : result.companyDetails ? result.companyDetails.companyLogo : null;

    if (existingFile) {
        const s3Client = new S3Client({ region: 'eu-north-1' });
        try {
       
            await s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: existingFile }));
        } catch (deleteError) {
            console.error("Error deleting file from S3:", deleteError);
        }
    }

    const fileUrl = await uploadTosS3(file.buffer, file.mimetype);
    return fileUrl;
}


  async updateResume(employeeId: string, file: Express.Multer.File): Promise<any> {
    try {
        const documentUrl = await this.uploadFileToS3(employeeId, file, "resume");

        const documentMetadata = {
            documentName: file.originalname,
            documentUrl,
            documentSize: file.size,
            uploadedAt: new Date(),
        };

        // Update employee document details in the repository
        const result = await this._employeeRepository.updateResume(employeeId, documentMetadata);

        return {
            success: true,
            message: "Resume uploaded successfully!",
            data: {
                documentUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${documentUrl}`,
                documentMetadata: result,
            },
        };
    } catch (error) {
        console.error("Error in updateResume service:", error);
        throw new Error("Failed to update resume");
    }
}

async updateBlocking(employeeId: string, blocking: any): Promise<any> {
  try {
      const result = await this._employeeRepository.updateBlocking(employeeId, blocking);
      
      return result;
  } catch (error) {
      console.error("Error in updateBlocking service:", error);
      throw new Error("Failed to update blocking");
  }
}

async getEmployeeWithOutDepartment(): Promise<IEmployeesDTO[]> {
    try {
        const employeesData = await this._employeeRepository.getEmployeeWithOutDepartment();
        

        const employeesDTO: IEmployeesDTO[] = employeesData.map((employee) => ({
            employeeName: employee.personalDetails.employeeName, // Assuming `name` is the field in the repository data
            position: employee.professionalDetails.position,
            isActive: employee.isActive,
            profilePicture: employee.personalDetails.profilePicture ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}` : employee.personalDetails.profilePicture , 
            email: employee.employeeCredentials.companyEmail,
            employeeId: employee._id, 
            isBlocked: employee.isBlocked
        }));

        return employeesDTO;
    } catch (error) {
        console.error("Error in service layer:", error);
        throw new Error("Failed to fetch employees data");
    }
}

async removeEmployee(employeeId: string): Promise<any> {
  try {
      const result = await this._employeeRepository.removeEmployee(employeeId);
      return result;
  } catch (error) {
      console.error("Error in removeEmployee service:", error);
      throw error;
  }
}


async updateCredentials(employeeId: string ,credentials: any): Promise<any> {
  try {
      const result = await this._employeeRepository.updateCredentials(employeeId, credentials);
      return result;
  } catch (error) {
      console.error("Error in updateCredentials service:", error);
      throw error;
  }
}


}

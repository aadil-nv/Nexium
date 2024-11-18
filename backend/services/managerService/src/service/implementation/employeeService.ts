import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import { inject, injectable } from "inversify";
import IEmployeeService from "../interface/IEmployeeService";
import { verifyRefreshToken } from "../../utils/jwt";
import { generateEmail } from "../../utils/generateEmail";
import { generatePassword } from "../../utils/generatePassword";
import nodemailer from "nodemailer";
import { generateOfferLetter } from "../../utils/generateOfferLetter";
import { decode } from "punycode";


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
    @inject("IEmployeeRepository") private _employeeRepository: IEmployeeRepository
  ) {}

  async addEmployees(employeeData: any, refreshToken: string): Promise<any> {
    console.log(`==========================================================`.bgRed);
    console.log(`===========employeeData===========`, employeeData);
    console.log(`==========================================================`.bgRed);
    console.log("");
  
    try {
      const decoded = verifyRefreshToken(refreshToken);
      console.log("decoded", decoded);
      const managerId = decoded?.result._id;
  
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
      console.log(`========================================`.bgGreen);
      console.log("mappedEmployeeData", mappedEmployeeData);
      console.log(`========================================`.bgGreen);
    
      const managerName = decoded?.result.name;
      mappedEmployeeData.professionalDetails.salary = employeeData.salary;
      mappedEmployeeData.professionalDetails.workTime = employeeData.workTime;
      mappedEmployeeData.professionalDetails.joiningDate = employeeData.joiningDate;
    //   mappedEmployeeData.professionalDetails.department = employeeData.department;
      mappedEmployeeData.professionalDetails.position = employeeData.position;
      mappedEmployeeData.professionalDetails.companyName = decoded?.result.managerCredentials.companyName;

      const email = generateEmail( mappedEmployeeData.professionalDetails.companyName, employeeData.name, managerId);
      console.log(`==========email============`.bgWhite, email);
  
 
      const password = generatePassword( mappedEmployeeData.professionalDetails.companyName, employeeData.name, managerId);
      console.log(`============password==========`.bgWhite, password);
  
      mappedEmployeeData.employeeCredentials.companyEmail = email;
      mappedEmployeeData.employeeCredentials.companyPassword = password;
  
      console.log("mappedEmployeeData===========last ^^^^^^^^^^^^", mappedEmployeeData);
  
      const result = await this._employeeRepository.addEmployee(mappedEmployeeData);
      await this.sendOfferLetter(managerName, mappedEmployeeData);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error in addEmployees service:", error);
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

    if (!employeeData.department) {
      return { success: false, message: "Department is required" };
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
        zipCode: "",
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
      documents: {
        resume: "",
        idProof: "",
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

  async getEmployees(): Promise<any> {
    try {
      return await this._employeeRepository.getEmployees();
    } catch (error) {
      console.error("Error in service layer:", error);
      throw new Error("Failed to fetch employees data");
    }
  }
}

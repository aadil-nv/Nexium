import IEmployeeRepository from "../../repository/interface/IEmployeeRepository";
import { inject, injectable } from "inversify";
import IEmployeeService from "../interface/IEmployeeService";
import { generateEmail } from "../../utils/generateEmail";
import { generatePassword } from "../../utils/generatePassword";
import nodemailer from "nodemailer";
import { generateOfferLetter } from "../../utils/generateOfferLetter";
import { IEmployeeAddressDTO, IEmployeePersonalInformationDTO, IEmployeesDTO } from "../../dto/IEmployeesDTO";
import RabbitMQMessager from "../../events/implementation/producer";



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
        console.log(`===============================================`.bgRed);
        console.log(`=====================managerData.businessOwnerId==========================`,managerData.businessOwnerId);
        
        mappedEmployeeData.businessOwnerId = managerData.businessOwnerId;
        console.log(`===============================================`.bgRed);
        mappedEmployeeData.personalDetails.employeeName = employeeData.name;
        mappedEmployeeData.professionalDetails.salary = employeeData.salary;
        mappedEmployeeData.professionalDetails.workTime = employeeData.workTime;
        mappedEmployeeData.professionalDetails.joiningDate = employeeData.joiningDate;
        mappedEmployeeData.professionalDetails.department = "";
        mappedEmployeeData.professionalDetails.position = employeeData.position;
        mappedEmployeeData.professionalDetails.companyName = managerData.companyDetails.companyName;

        const email = generateEmail(mappedEmployeeData.professionalDetails.companyName, employeeData.name, managerId);

        const password = generatePassword(mappedEmployeeData.professionalDetails.companyName, employeeData.name, managerId);

        mappedEmployeeData.employeeCredentials.companyEmail = email;
        mappedEmployeeData.employeeCredentials.companyPassword = password;


        const addedEmployee = await this._employeeRepository.addEmployee(mappedEmployeeData); // Renamed variable
        rabbitMQMessager.sendToMultipleQueues({ employeeData: addedEmployee });
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

  async getEmployees(): Promise<IEmployeesDTO[]> {
    try {
        const employeesData = await this._employeeRepository.findAll();

        // Map the repository data to the DTO structure
        const employeesDTO: IEmployeesDTO[] = employeesData.map((employee) => ({
            employeeName: employee.personalDetails.employeeName, // Assuming `name` is the field in the repository data
            position: employee.professionalDetails.position,
            isActive: employee.isActive,
            profilePicture: employee.personalDetails.profilePicture || "", // Provide a fallback for optional fields
            email: employee.personalDetails.email,
            _id: employee._id
        }));

        return employeesDTO;
    } catch (error) {
        console.error("Error in service layer:", error);
        throw new Error("Failed to fetch employees data");
    }
}

async getEmployeePersonalInformation(employeeId: string ) : Promise<IEmployeePersonalInformationDTO> {
    try {
        const employeeData = await this._employeeRepository.getEmployeeInformation(employeeId);

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

  async getEmployeeAddress(employeeId: string): Promise<IEmployeeAddressDTO> {
    try {
        const employeeData = await this._employeeRepository.getEmployeeInformation(employeeId);

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

   

}

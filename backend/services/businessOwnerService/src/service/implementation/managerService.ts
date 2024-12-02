import IManagerRepository from "../../repository/interface/IManagerReopsitory";
import IManagerService from "../interface/IManagerService";
import { inject, injectable } from "inversify";
import createManagerCredentials from "../../utils/generateManagerCredentials";
import generateOfferLetter from "../../utils/generateOfferLetter";
import nodemailer from "nodemailer";
import RabbitMQMessager from "../../events/rabbitmq/implementation/producer";
import { IResponseDTO } from "dto/businessOwnerDTO";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

@injectable()
export default class ManagerService implements IManagerService {
  private _managerRepository: IManagerRepository;

  constructor(@inject("IManagerRepoitory") managerRepository: IManagerRepository) {
    this._managerRepository = managerRepository;
  }

  async addManagers(businessOwnerId: string, data: any): Promise<IResponseDTO> {
    console.log(`===================`.bgCyan.bold, data);

    try {
        const rabbitMQMessager = new RabbitMQMessager();
        await rabbitMQMessager.init();


        this.validateManagerData(data);

 
        const businessOwnerData = await this._managerRepository.findById(businessOwnerId);
        if (!businessOwnerData) throw new Error("Business owner not found");

        // Check if a manager with the same email already exists
        const existingEmail = await this._managerRepository.findByEmail(businessOwnerId, data.email);
        if (existingEmail) throw new Error("Manager with this email already exists");

        // Generate manager credentials
        const managerCredentials = createManagerCredentials(
            businessOwnerData.companyDetails.companyName,
            businessOwnerId,
            data.name
        );
        console.log(`managerCredentials:`.bgWhite, managerCredentials);

        // Prepare `managerData` structure
        const newManagerData: any = {
            personalDetails: {
                managerName: data.name,
                email: data.email,
                personalWebsite: '', // Default value
                profilePicture: data.profileImage || "",
                phone: data.phoneNumber,
            },
            professionalDetails: {
                managerType: data.managerType,
                joiningDate: data.joiningDate || new Date(),
                salary: data.salary,
                workTime: data.workTime,
            },
            companyDetails: {
                companyName: businessOwnerData.companyDetails.companyName,
                companyLogo: data.companyLogo || undefined,
            },
            managerCredentials: {
                companyEmail: managerCredentials.managerCredentials.email,
                companyPassword: managerCredentials.managerCredentials.password,
            },
            address: {
              street: "",
              city: "",
              state: "",
              zip: "",
              country:"",
            },
            documents: [
              {
                documentName: "HR Document", // Default name
                documentUrl: "https://example.com/default-document", // Default URL
                uploadedAt: new Date(), // Default timestamp
              },
            ],
            businessOwnerId,
            subscriptionId: businessOwnerData.subscription.subscriptionId,
        };

        console.log(`Prepared Manager Data:`, newManagerData);

        // Send offer letter
        await this.sendOfferLetter(data.name, managerCredentials.managerCredentials, data.email);

        // Add the manager to the database
        const managerData = await this._managerRepository.addManagers(businessOwnerId, newManagerData);

        // Send the new manager data to RabbitMQ for further processing
        rabbitMQMessager.sendToMultipleQueues({ managerData });

        return {
          success:true,
          message:"Manager added successfully"
        }
    } catch (error: any) {
        console.error("Error adding HR Manager:", error.message.bgRed);
        throw new Error(error.message || "Error adding HR Manager");
    }
}

  
  private validateManagerData(data: any): void {
    // Validate manager name
    if (!data.name || data.name.length < 3) throw new Error("Manager name must be at least 3 characters long");
    console.log(`Manager Name: ${data.name}`.green);
  
    // Validate email format
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error("Invalid email address");
    console.log(`Manager Email: ${data.email}`.blue);
  
    // Validate phone number
    if (!data.phoneNumber || !/^\d{10}$/.test(data.phoneNumber)) throw new Error("Phone number must be exactly 10 digits");
    if (/(.)\1{2,}/.test(data.phoneNumber)) throw new Error("Phone number must not have consecutive numbers");
    console.log(`Manager Phone Number: ${data.phoneNumber}`.yellow);
  
    // Validate joining date (should not be in the past)
    if (!data.joiningDate || new Date(data.joiningDate) < new Date()) {
      console.log(`Invalid Joining Date: ${data.joiningDate}`.bgRed);
      throw new Error("Joining date must be today or a future date");
    }
    console.log(`Manager Joining Date: ${data.joiningDate}`.cyan);
  
    // Validate salary (must be a positive number and an integer)
    // if (typeof data.salary !== 'number' || data.salary <= 0) throw new Error("Salary must be a positive number");
    // console.log(`Manager Salary: ${data.salary}`.magenta);
  
    // Validate work time and manager type
    if (!data.workTime) throw new Error("Work time is required");
    if (!data.managerType) throw new Error("Manager type is required");
  
    console.log(`Work Time: ${data.workTime}`.green);
    console.log(`Manager Type: ${data.managerType}`.blue);
  }
  
  

  async sendOfferLetter(managerName: string, managerCredentials: any, managerEmail: string): Promise<void> {
    try {
      const offerLetterContent = generateOfferLetter(managerName, managerCredentials);
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: managerEmail,
        subject: `Offer Letter for ${managerCredentials.companyName} Manager`,
        html: offerLetterContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Offer letter sent: %s", info.messageId);
    } catch (error) {
      console.error("Error sending offer letter:", error);
      throw new Error("Failed to send offer letter. Please try again later.");
    }
  }

  async getAllManagers(businessOwnerId: string): Promise<any[]> {
    try {
      return await this._managerRepository.getAllManagers(businessOwnerId);
    } catch (error) {
      console.error("Error fetching managers:", error);
      throw error;
    }
  }

  async blockManager(businessOwnerId: string, managerData: any): Promise<any> {
    try {
      // Pass managerData as-is to the repository, allowing it to handle the toggling
      return await this._managerRepository.blockManager(businessOwnerId, managerData);
    } catch (error) {
      console.error("Error toggling manager block status:", error);
      throw error;
    }
  }
  
}

import IManagerRepository from "../../repository/interface/IManagerReopsitory";
import IManagerService from "../interface/IManagerService";
import { inject, injectable } from "inversify";
import createManagerCredentials from "../../utils/generateManagerCredentials";
import generateOfferLetter from "../../utils/generateOfferLetter";
import nodemailer from "nodemailer";
import RabbitMQMessager from "../../events/rabbitmq/implementation/producer";

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

  async addManagers(businessOwnerId: string, managerData: any): Promise<any> {
    try {
      const rabbitMQMessager = new RabbitMQMessager();
      await rabbitMQMessager.init();

      this.validateManagerData(managerData);

      const businessOwnerData = await this._managerRepository.findById(businessOwnerId);
      if (!businessOwnerData) throw new Error("Business owner not found");

      const existingEmail = await this._managerRepository.findByEmail(businessOwnerId, managerData.email);
      if (existingEmail) throw new Error("Manager with this email already exists");

      const managerCredentials = createManagerCredentials(
        businessOwnerData.companyName,
        businessOwnerId,
        managerData.name
      );

      managerData.subscriptionId = businessOwnerData.subscription.subscriptionId;
      managerData.businessOwnerId = businessOwnerId;
      managerData.managerCredentials = managerCredentials.managerCredentials;

      await this.sendOfferLetter(managerData.name, managerCredentials.managerCredentials, managerData.email);

      const newManagerData = await this._managerRepository.addManagers(businessOwnerId, managerData);
      rabbitMQMessager.sendToMultipleQueues({ newManagerData });

      return newManagerData;
    } catch (error: any) {
      console.error("Error adding HR Manager:", error);
      throw new Error(error.message || "Error adding HR Manager");
    }
  }

  private validateManagerData(managerData: any): void {
    if (!managerData.name || managerData.name.length < 3) throw new Error("Manager name must be at least 3 characters long");
    if (!managerData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerData.email)) throw new Error("Invalid email address");
    if (!managerData.phoneNumber || !/^\d{10}$/.test(managerData.phoneNumber)) throw new Error("Phone number must be exactly 10 digits");
    if (/(.)\1{2,}/.test(managerData.phoneNumber)) throw new Error("Phone number must not have consecutive numbers");
    if (!managerData.joiningDate || new Date(managerData.joiningDate) < new Date()) throw new Error("Joining date must be today or a future date");
    if (typeof managerData.salary !== 'string' || managerData.salary <= 0) throw new Error("Salary must be a positive number");
    if (!managerData.workTime) throw new Error("Work time is required");
    if (!managerData.managerType) throw new Error("Manager type is required");
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
}

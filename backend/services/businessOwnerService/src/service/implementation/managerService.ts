
import IManagerRepoitory from "../../repository/interface/IManagerReopsitory";
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

    private managerRepository: IManagerRepoitory

    constructor(@inject("IManagerRepoitory") managerRepository: IManagerRepoitory) {
        this.managerRepository = managerRepository;
    }

    
    async addManagers(businessOwnerId: string, managerData: any): Promise<any> {
        try {
          const rabbitMQMessager = new RabbitMQMessager();
          console.log('rabbitMQMessager',rabbitMQMessager);
          await rabbitMQMessager.init();
          const businessOwnerData = await this.managerRepository.findById(businessOwnerId);
          const subscriptionId = businessOwnerData.subscription.subscriptionId;
          const companyName = businessOwnerData.companyName;
          const companyRegistrationNumber = businessOwnerData.registrationNumber || "";  // Handle empty registration number case
          const managerName = managerData.name;
      
          const managerCredentials = createManagerCredentials(companyName, companyRegistrationNumber, managerName);
      
          
          managerData.subscriptionId = subscriptionId;
          managerData.businessOwnerId = businessOwnerId;
      
         
          managerData.managerCredentials = {
            companyName: managerCredentials.managerCredentials.companyName,
            companyRegistrationNumber: managerCredentials.managerCredentials.companyRegistrationNumber,
            email: managerCredentials.managerCredentials.email,
            password: managerCredentials.managerCredentials.password,
          };
          await this.sendOfferLetter(managerName, managerCredentials.managerCredentials, managerData.email);
          const newMangerData = await this.managerRepository.addManagers(businessOwnerId, managerData);
          console.log(`"newMangerData"`.bgCyan,newMangerData);
          
          rabbitMQMessager.sendToMultipleQueues({newMangerData:newMangerData});
          console.log(`"newMangerData"`.bgWhite,);

          return newMangerData
        } catch (error) {
          console.error("Error adding HR Manager:", error);
          throw error;
        }
      }

    async sendOfferLetter(managerName: string, managerCredentials: any ,managerEmail: string):Promise<any> {
        try {
            const offerLetterContent = generateOfferLetter(managerName, managerCredentials);
            const mailOptions = {
                from: 'your-email@gmail.com',
                to: managerEmail,
                subject: `Offer Letter for ${managerCredentials.companyName} Manager`,
                html: offerLetterContent,
              };

              const info = await transporter.sendMail(mailOptions);
              console.log("OTP email sent: %s", info.messageId);



        } catch (error) {
            console.error("Error sending OTP email:", error);
            throw new Error("Failed to send OTP. Please try again later.");
        }
    }  
        
    async getAllManagers(businessOwnerId: string): Promise<any[]> {
        
        try {
            return await this.managerRepository.getAllManagers(businessOwnerId)
        } catch (error) {
            console.error("Error fetching managers:", error);
            throw error
        }
    }
    
}
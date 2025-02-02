// import { inject, injectable } from "inversify";
// import IMeetingService from "../interface/IMeetingService";
// import IMeetingRepository from "../../repository/interface/IMeetingRepository";
// import { IGetAllMeetingsDTO, IMeetingsDTO, IParticipantsDTO } from "../../dto/meetingDTO";
// import { IMeeting } from "../../entities/meetingEntities";
// import IChatRepository from "repository/interface/IChatRepository";
// import { IParticipantDetails } from "dto/chatDTO";

// @injectable()
// export default class MeetingService implements IMeetingService {
//   constructor(@inject("IMeetingRepository") private _meetingRepository: IMeetingRepository,
//               @inject("IChatRepository") private _chatRepository: IChatRepository) {}

//               async getAllMeetings(myId: string): Promise<IGetAllMeetingsDTO[]> {
//                 try {
//                   const meetings: IMeeting[] = await this._meetingRepository.getAllMeetings(myId);
//                   console.log("Meetings from repository:", JSON.stringify(meetings, null, 2));
              
//                   const meetingDTOs: IGetAllMeetingsDTO[] = meetings
//                     .map((meeting) => {
//                       try {
//                         const receiver = this.findReceiver(meeting.participants, myId);
//                         if (!receiver) {
//                           console.warn(`Skipping meeting ${meeting._id} - no valid receiver found`);
//                           return null;
//                         }
//                         return this.mapToDTO(meeting, receiver, myId);
//                       } catch (error: any) {
//                         console.error(`Error mapping meeting ${meeting._id}: ${error.message}`);
//                         return null;
//                       }
//                     })
//                     .filter((meeting): meeting is IGetAllMeetingsDTO => meeting !== null); // Filter out invalid results
              
//                   console.log("Final meeting DTOs:", JSON.stringify(meetingDTOs, null, 2));
//                   return meetingDTOs;
//                 } catch (error: any) {
//                   console.error("Error getting all meetings:", error.message);
//                   throw new Error(`Failed to get all meetings: ${error.message}`);
//                 }
//               }
              
//               private findReceiver(participants: IParticipantDetails[], myId: string): IParticipantDetails | null {
//                 const receiver = participants.find((participant) => participant._id.toString() !== myId) || null;
//                 console.log("Found receiver:", JSON.stringify(receiver, null, 2));
//                 return receiver;
//               }
              
//               private mapToDTO(meeting: IMeeting, receiver: IParticipantDetails, myId: string): IGetAllMeetingsDTO {
//                 const receiverName = this.getReceiverName(receiver);
//                 const receiverPosition = this.getReceiverPosition(receiver);
//                 const profilePicture = this.getProfilePicture(receiver);
              
//                 console.log(`Receiver Name: ${receiverName}`);
//                 console.log(`Receiver Position: ${receiverPosition}`);
//                 console.log(`Profile Picture: ${profilePicture}`);
              
//                 return {
//                   _id: meeting._id,
//                   meetingTitle: meeting.meetingTitle,
//                   meetingDate: meeting.meetingDate,
//                   meetingTime: meeting.meetingTime,
//                   participants: meeting.participants.map((participant: IParticipantDetails) => {
//                     const participantName = this.getReceiverName(participant);
//                     const participantPosition = this.getReceiverPosition(participant);
//                     const participantPicture = this.getProfilePicture(participant);
              
//                     console.log(`Participant: ${participant._id}, Name: ${participantName}, Position: ${participantPosition}, Picture: ${participantPicture}`);
              
//                     return {
//                       userId: participant._id.toString(),
//                       userName: participantName,
//                       userPosition: participantPosition,
//                       profilePicture: participantPicture
//                         ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${participantPicture}`
//                         : undefined,
//                     };
//                   }),
//                   meetingLink: meeting.meetingLink,
//                   scheduledBy: meeting.scheduledBy.toString(),
//                 };
//               }
              
//               private getReceiverName(receiver: IParticipantDetails): string {
//                 console.log("Processing receiver for name:", JSON.stringify(receiver, null, 2));
//                 return (
//                   receiver.personalDetails?.employeeName ||
//                   receiver.personalDetails?.managerName ||
//                   receiver.personalDetails?.businessOwnerName ||
//                   "Unknown"
//                 );
//               }
              
//               private getReceiverPosition(receiver: IParticipantDetails): string {
//                 console.log("Processing receiver for position:", JSON.stringify(receiver, null, 2));
//                 return receiver.professionalDetails?.position || receiver.role || "Unknown";
//               }
              
//               private getProfilePicture(receiver: IParticipantDetails): string | undefined {
//                 console.log("Processing receiver for profile picture:", JSON.stringify(receiver, null, 2));
//                 return receiver.personalDetails?.profilePicture;
//               }
              
              



//   async createMeeting(meeting: any, myId: string): Promise<IMeetingsDTO> {
//     try {
//       // Call repository method to create the meeting
//       const createdMeeting = await this._meetingRepository.createMeeting(meeting, myId);

//       // Map the returned data to ensure it matches IMeetingsDTO
//       const mappedMeeting: IMeetingsDTO = {
//         _id: createdMeeting._id, // Convert ObjectId to string
//         meetingTitle: createdMeeting.meetingTitle,
//         meetingDate: new Date(createdMeeting.meetingDate),
//         meetingTime: createdMeeting.meetingTime,
//         participants: createdMeeting.participants.map((p: any) => p.toString()), // Convert ObjectId[] to string[]
//         meetingLink: createdMeeting.meetingLink,
//         scheduledBy: createdMeeting.scheduledBy.toString(), // Convert ObjectId to string
//       };

//       return mappedMeeting;
//     } catch (error: any) {
//       console.error("Error creating meeting:", error.message);
//       throw new Error("Failed to create meeting. Please try again later.");
//     }
//   }

//   async updateMeeting(meetingId: string, meeting: any): Promise<IMeetingsDTO> {
//     try {
//       // Call repository method to update the meeting
//       const updatedMeeting = await this._meetingRepository.updateMeeting(meetingId, meeting);

//       // Map the returned data to ensure it matches IMeetingsDTO
//       const mappedMeeting: IMeetingsDTO = {
//         _id: updatedMeeting._id, // Convert ObjectId to string
//         meetingTitle: updatedMeeting.meetingTitle,
//         meetingDate: new Date(updatedMeeting.meetingDate),
//         meetingTime: updatedMeeting.meetingTime,
//         participants: updatedMeeting.participants.map((p: any) => p.toString()), // Convert ObjectId[] to string[]
//         meetingLink: updatedMeeting.meetingLink,
//         scheduledBy: updatedMeeting.scheduledBy.toString(), // Convert ObjectId to string
//       };

//       return mappedMeeting;
//     } catch (error: any) {
//       console.error("Error updating meeting:", error.message);
//       throw new Error("Failed to update meeting. Please try again later.");
//     }
//       }

//       async deleteMeeting(meetingId: string): Promise<IMeetingsDTO> {
//         try {
//           // Call repository method to delete the meeting
//           const deletedMeeting = await this._meetingRepository.deleteMeeting(meetingId);
  
//           // Map the returned data to ensure it matches IMeetingsDTO
//           const mappedMeeting: IMeetingsDTO = {
//             _id: deletedMeeting._id, // Convert ObjectId to string
//             meetingTitle: deletedMeeting.meetingTitle,
//             meetingDate: new Date(deletedMeeting.meetingDate),
//             meetingTime: deletedMeeting.meetingTime,
//             participants: deletedMeeting.participants.map((p: any) => p.toString()), // Convert ObjectId[] to string[]
//             meetingLink: deletedMeeting.meetingLink,
//             scheduledBy: deletedMeeting.scheduledBy.toString(), // Convert ObjectId to string
//           };
  
//           return mappedMeeting;
//         } catch (error: any) {
//           console.error("Error deleting meeting:", error.message);
//           throw new Error("Failed to delete meeting. Please try again later.");
//         }
//       }

//       async getAllParticipants(myId: string): Promise<IParticipantsDTO[]> {
//         try {
//           // Call repository method to get all participants
//           const employees = await this._chatRepository.findAllEmployees();
//           const managers = await this._chatRepository.findAllManagers();
//           const businessOwners = await this._chatRepository.findAllBusinessOwners();
  
//           // Map the returned data to ensure it matches IParticipantsDTO
//           const buisinessOwner: IParticipantsDTO[] = businessOwners.map(businessOner => ({
//                          userId: businessOner._id,
//                          userName: businessOner.personalDetails.businessOwnerName,
//                          userPosition: businessOner.role, 
//                          status: true,
//                          profilePicture: businessOner.personalDetails.profilePicture
//                              ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${businessOner.personalDetails.profilePicture}`
//                              : businessOner.personalDetails.profilePicture,
//                      }));
         
             
//                      // Map employee data
//                      const employee: IParticipantsDTO[] = employees.map(employee => ({
//                          userId: employee._id,
//                          userName: employee.personalDetails.employeeName,
//                          userPosition: employee.professionalDetails.position,
//                          status: employee.isActive,
//                          profilePicture: employee.personalDetails.profilePicture
//                              ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${employee.personalDetails.profilePicture}`
//                              : employee.personalDetails.profilePicture,
//                      }));
             
//                      // Map manager data
//                      const manager: IParticipantsDTO[] = managers.map(manager => ({
//                          userId: manager._id,
//                          userName: manager.personalDetails.managerName,
//                          userPosition : manager.role,
//                         profilePicture: manager.personalDetails.profilePicture
//                              ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${manager.personalDetails.profilePicture}`
//                              : manager.personalDetails.profilePicture,
//                      }));
             
                     
//                      const userDTO = [...employee, ...manager, ...buisinessOwner].filter(
//                          receiver => receiver.userId.toString() !== myId
//                      );
             
//                      return userDTO;
//         } catch (error: any) {
//           console.error("Error getting all participants:", error.message);
//           throw new Error("Failed to get all participants. Please try again later.");
//         }
//       }


// }


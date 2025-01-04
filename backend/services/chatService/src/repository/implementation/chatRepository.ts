import { inject , injectable } from "inversify";
import  IChatRepository  from "../../repository/interface/IChatRepository";
import { IChat } from "../../entities/chatEntities";
import BaseRepository from "./baseRepository";
import mongoose from "mongoose";
import IEmployee from "../../entities/employeeEntities";
import { IManager } from "../../entities/managerEntities";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntities";

@injectable()

export default class ChatRepository extends BaseRepository <IChat> implements IChatRepository {
    constructor(@inject("IChat") 
    private _chatModel: mongoose.Model<IChat>,
    @inject("IEmployee")
     private _employeeModel: mongoose.Model<IEmployee>,
    @inject("IManager")
    private _managerModel: mongoose.Model<IManager>,
    @inject("IBusinessOwnerDocument") 
    private _businessOwnerModel: mongoose.Model<IBusinessOwnerDocument>) {
        super(_chatModel);
        
    }

    async createChat(chat: any): Promise<IChat> {
        try {
            const createdChat = new this._chatModel(chat);
            return await createdChat.save();
            
        } catch (error) {
            console.log("Error creating chat:", error);
            throw error;
            
        }
    }

    async findAllEmployees(): Promise<IEmployee[]> {
        try {
            const allReceiver = await this._employeeModel.find();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }
    async findAllManagers(): Promise<IManager[]> {
        try {
            const allReceiver = await this._managerModel.find();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }
    async findAllBusinessOwners(): Promise<IBusinessOwnerDocument[]> {
        try {
            const allReceiver = await this._businessOwnerModel.find();
            return allReceiver;
            
        } catch (error) {
            console.log("Error getting all employees:", error);
            throw error;
            
        }
    }
}
import { inject , injectable } from "inversify";
import { Request, Response } from "express";
import  IChatService  from "../../service/interface/IChatService";
import  IChatController  from "../interface/IChatController";



@injectable()
export default class ChatController implements IChatController {
    constructor(@inject("IChatService") private _chatService: IChatService) {}

    async createChat(req: Request, res: Response): Promise<Response> {
        try {
            const chat = req.body;
            const response = await this._chatService.createChat(chat);
            return res.status(200).json(response);
            
        } catch (error) {
            return res.status(500).json({ message: "Error creating chat", error: error });
            
        }
     
        
    }

    async getAllReceiver(req: Request, res: Response): Promise<Response> {
        // console.log(`getAllReceiver called`.bgCyan);
        
        try {
            const response = await this._chatService.getAllReceiver();
            // console.log(`getAllReceiver response: ${response}`.bgCyan,response);
            return res.status(200).json(response);

        } catch (error) {
            return res.status(500).json({ message: "Error getting all employees", error: error });
            
        }
     
        
    }

    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
        console.log(`---------------setNewAccessToken called---------------`.bgRed);
        
        try {
            const refreshToken = req.cookies?.refreshToken;

            const response = await this._chatService.setNewAccessToken(refreshToken);
            if (!response.accessToken) {
                console.error("Failed to generate a new access token.");
                return res.status(401).json({ message: 'Failed to generate new access token.' });
              }
          
          
          
              res.cookie('accessToken', response.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000, // 1 hour
                sameSite: 'strict',
              });

            return res.status(200).json(response);
            
        } catch (error) {
            return res.status(500).json({ message: "Error getting all employees", error: error });
            
        }
     
        
    }

    async logout(req: Request, res: Response): Promise<Response> {
        try {
          res.clearCookie('accessToken');
          res.clearCookie('refreshToken');
          return res.status(200).json({ message: "Logout successful" });
          
        } catch {
          return res.status(500).json({ message: "Error logging out" });
        }
      }
}



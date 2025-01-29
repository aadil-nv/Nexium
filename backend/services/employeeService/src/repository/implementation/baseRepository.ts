import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import IBaseRepository from "../interface/IBaseRepository";
import { injectable } from "inversify";

@injectable()
export default class BaseRepository<T extends Document> implements IBaseRepository<T> {
    private readonly model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }


    async findOne(filter: FilterQuery<T>): Promise<T | null> {

        console.log(`Repository calling ----------------`.bgGreen);
        
        try {
            console.log(`Repository calling ----------------`.bgBlue,filter.employeeId);
            console.log(`Repository calling ----------------`.bgYellow,this.model);
            
            const document = await this.model.findOne({employeeId: filter.employeeId}).exec();
            console.log("DOCUMENTIS ",document);
            
            return document; 
        } catch (error) {
            console.error("Error finding document:", error);
            return null; 
        }
    }

 
    async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
        try {
            return await this.model.find(filter).exec();
        } catch (error) {
            console.error("Error finding documents:", error);
            return [];
        }
    }


    async create(data: Partial<T>): Promise<T> {
        try {
            const createdDocument = new this.model(data);
            return await createdDocument.save();
        } catch (error) {
            console.error("Error creating document:", error);
            throw error;
        }
    }


    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            const updatedDocument = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
            return updatedDocument;
        } catch (error) {
            console.error("Error updating document:", error);
            return null;
        }
    }

   
    async delete(id: string): Promise<T | null> {
        try {
            const deletedDocument = await this.model.findByIdAndDelete(id).exec();
            return deletedDocument;
        } catch (error) {
            console.error("Error deleting document:", error);
            return null;
        }
    }

}

import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import IBaseRepository from "../interface/IBaseRepository";  // Correct base interface import
import { injectable } from 'inversify';
import managerModel from '../../models/managerModel';
import employeeModel from '../../models/employeeModel';
import businessOwnerModel from '../../models/businessOwnerModel';

@injectable()
export default class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(private model: Model<T>) {}

  // Find one document
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    console.log("hitting base repo----------", filter);
    
    try {
        console.log("MOdel is -", this.model);
        
        const document = await this.model.findOne(filter).exec();
        console.log("Document found:", document);
        
        return document;  // Return the document found
    } catch (error) {
        console.error("Error finding document:", error);
        return null;  // Return null if an error occurs
    }
  }

  // Find all documents
  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    try {
        return await this.model.find(filter).exec();  // Ensure the result is returned
    } catch (error) {
        console.error("Error finding documents:", error);
        return [];  // Return an empty array if an error occurs
    }
  }

  // Create a new document
  async create(data: Partial<T>): Promise<T> {
    try {
        const createdDocument = new this.model(data);
        return await createdDocument.save();  // Return the saved document
    } catch (error) {
        console.log("Error creating document:", error);
        throw error;  // Rethrow error if desired, or return a default value
    }
  }

  // Update a document by its ID
  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    try {
        const updatedDocument = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
        return updatedDocument;  // Return the updated document
    } catch (error) {
        console.log("Error updating document:", error);
        return null;  // Return null if an error occurs
    }
  }

  // Delete a document by its ID
  async delete(id: string): Promise<T | null> {
    try {
        const deletedDocument = await this.model.findByIdAndDelete(id).exec();
        return deletedDocument;  // Return the deleted document
    } catch (error) {
        console.log("Error deleting document:", error);
        return null;  // Return null if an error occurs
    }
  }
}

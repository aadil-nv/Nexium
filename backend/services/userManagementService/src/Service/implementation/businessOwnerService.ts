// services/BusinessOwnerService.ts

import { IHRManager } from "../../entities/hrManagerEntity";
import { HRManagerRepository } from "../../Repositery/implementation/businessOwnerRepositery";

export class BusinessOwnerService {
  private hrManagerRepo: HRManagerRepository;

  constructor() {
    this.hrManagerRepo = new HRManagerRepository();
  }

  async addHRManagerToCompany(hrManagerData: IHRManager): Promise<IHRManager> {
    console.log("BusinessOwnerService - Adding HR Manager:", hrManagerData);
    
    // Validate the HR Manager data before adding
    if (!hrManagerData.name || !hrManagerData.email) {
      throw new Error("Name and email are required");
    }

    return await this.hrManagerRepo.addHRManager(hrManagerData);
  }
}

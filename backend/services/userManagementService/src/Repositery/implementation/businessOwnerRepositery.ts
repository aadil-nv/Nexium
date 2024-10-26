// repositories/HRManagerRepository.ts

import { IHRManager } from "../../entities/hrManagerEntity";
import HRManagerModel from "../../Schemas/hrManagerSchema"; // Adjust the import based on your model path

export class HRManagerRepository {
  async addHRManager(hrManagerData: IHRManager): Promise<IHRManager> {
    const hrManager = new HRManagerModel(hrManagerData);
    return await hrManager.save(); // This returns a Promise<IHRManager>
  }
}

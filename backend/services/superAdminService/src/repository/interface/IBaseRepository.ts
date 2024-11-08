export default interface IBaseRepository {
    findByName(planeName: string ): Promise<any>;
    findByIdAndUpdate(id: string, data: any): Promise<any>;
    findById(id: string): Promise<any>;
}
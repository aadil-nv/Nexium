export default interface ISuperAdminController {
    getAllServiceRequest(): Promise<any>;
    updateServiceRequestStatus(id: string, status: string): Promise<any>;
}
export default interface ISubscriptionRepository {
   
    addSubscription(subscriptionData:string): Promise<any>;
    fetchAllSubscriptions(): Promise<any>;
    updateById(id: string, updateData: any): Promise<any>;
}
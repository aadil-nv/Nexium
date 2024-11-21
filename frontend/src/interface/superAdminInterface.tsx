export interface IBusinessOwner {
    id: string;
    name: string;
    email: string;
    phone: string;
    registrationNumber: string;
    subscriptionStatus: string;
    isBlocked: boolean;
  }

  export interface IFormInputs {
    email: string;
    password: string;
  }
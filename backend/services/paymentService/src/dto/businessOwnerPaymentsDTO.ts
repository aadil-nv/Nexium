export interface IPaymentIntentResponseDTO {
    success: boolean;
    message?: string;
    role?: string;
    planName?: string;
    session?: any;
    accessToken?: string;
    refreshToken?: string;
    
    }
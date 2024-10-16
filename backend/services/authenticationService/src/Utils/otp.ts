

export default function generateOtp(): string {
   console.log("Generating OTP...");
   
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
}

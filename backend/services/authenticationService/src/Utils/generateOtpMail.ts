export function generateOtpMail(email: string, otp: string, expirationTime: string): any {
    const currentDate = new Date().toLocaleString();

    return {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Verification",
        text: `Your OTP for verification is ${otp}. It is valid for ${expirationTime}.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                <div style="text-align: center;">
                    <img src="Nexium" alt="Company Logo" style="width: 150px; height: auto; margin-bottom: 20px;" />
                </div>
                <h2 style="color: #333; text-align: center;">Your OTP for Verification</h2>
                <p style="font-size: 16px; color: #555; text-align: center;">
                    Your OTP for verification is <strong style="font-size: 24px; color: #4CAF50;">${otp}</strong>.
                </p>
                <p style="font-size: 14px; color: #555; text-align: center;">
                    This OTP is valid for <strong style="color: #FF5722;">${expirationTime}</strong> from the time of request.
                </p>
                <p style="font-size: 14px; color: #888; text-align: center;">
                    Date: <strong>${currentDate}</strong>
                </p>
                <p style="font-size: 14px; color: #888; text-align: center;">
                    Please do not share this OTP with anyone.
                </p>
                <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
                    &copy; ${new Date().getFullYear()} Nexium All rights reserved.
                </footer>
            </div>
        `,
    };
}
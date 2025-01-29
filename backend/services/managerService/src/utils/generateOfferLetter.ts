export function generateOfferLetter(managerName: string, mappedEmployeeData: any): string {
    // Define the offer letter content (HTML formatted)
    const emailContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-logo { width: 100px; height: auto; }
            .details { margin-top: 20px; }
            .accept-button { background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; border-radius: 5px; display: inline-block; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: gray; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${"https://avatar.iran.liara.run/public/boy?username=Ash"}" alt="${mappedEmployeeData.professionalDetails.companyName} Logo" class="company-logo" />
            <h2>Offer Letter from ${mappedEmployeeData.professionalDetails.companyName}</h2>
          </div>
          
          <div class="details">
            <p>Dear ${mappedEmployeeData.name},</p>
            <p>We are pleased to offer you the position at ${mappedEmployeeData.professionalDetails.companyName}. Below are your details:</p>
            
            <ul>
              <li><strong>Email ID:</strong> ${mappedEmployeeData.employeeCredentials.companyEmail}</li>
              <li><strong>Password:</strong> ${mappedEmployeeData.employeeCredentials.companyPassword}</li>
              <li><strong>Salary:</strong> ${mappedEmployeeData.professionalDetails.salary}</li>
              <li><strong>Work Time:</strong> ${mappedEmployeeData.professionalDetails.workTime}</li>
              <li><strong>Joining Date:</strong> ${mappedEmployeeData.professionalDetails.joiningDate}</li>
            </ul>
            
            <p>We look forward to your positive response and are excited to have you join our team!</p>
            
            <a href="http://example.com/accept-offer?email=${mappedEmployeeData.employeeCredentials.companyEmail}" class="accept-button">Accept Offer</a>
          </div>
          
          <div class="footer">
            <p>If you have any questions, feel free to reach out to us at <strong>support@${mappedEmployeeData.professionalDetails.companyName.toLowerCase()}.com</strong>.</p>
          </div>
        </body>
      </html>
    `;
  
    // Return the email content
    return emailContent;
  }
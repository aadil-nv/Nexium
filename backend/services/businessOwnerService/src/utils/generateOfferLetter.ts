interface ManagerCredentials {
    companyName: string;
    companyRegistrationNumber: string;
    email: string;
    password: string;
  }
  

function generateOfferLetter(managerName: string, managerCredentials: ManagerCredentials): string {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #2a9d8f;
              text-align: center;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
              margin-bottom: 20px;
            }
            ul {
              list-style-type: none;
              padding-left: 0;
            }
            ul li {
              font-size: 16px;
              margin-bottom: 10px;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #777;
              margin-top: 30px;
            }
            .footer a {
              color: #2a9d8f;
              text-decoration: none;
            }
            .button {
              background-color: #2a9d8f;
              color: white;
              padding: 10px 20px;
              text-align: center;
              border-radius: 5px;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Congratulations, ${managerName}!</h1>
            <p>We are excited to offer you the position of <strong>${managerCredentials.companyName} Manager</strong> at our company.</p>
            <p>Please find your initial login credentials below:</p>
            <ul>
              <li><strong>Email:</strong> ${managerCredentials.email}</li>
              <li><strong>Password:</strong> ${managerCredentials.password}</li>
            </ul>
            <p>We are thrilled to have you join our team. Please feel free to reach out if you have any questions.</p>
            <p>Best regards,<br><strong>Company HR</strong></p>
            
            <a href="#" class="button">Accept the Offer</a>
  
            <div class="footer">
              <p>If you have any questions, feel free to contact us at <a href="mailto:support@company.com">support@company.com</a>.</p>
              <p>Company Name | Address | Contact Number</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
  
  export default generateOfferLetter;
  
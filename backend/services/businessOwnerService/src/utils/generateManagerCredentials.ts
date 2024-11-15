interface ManagerCredentials {
  companyName: string;
  companyRegistrationNumber: string;
  email: string;
  password: string;
}

// Helper function to format email
function formatEmail(companyName: string, managerName: string): string {
  const formattedCompanyName = companyName.toLowerCase().replace(/\s+/g, '');
  const formattedManagerName = managerName.toLowerCase().replace(/\s+/g, '');
  return `${formattedManagerName}@${formattedCompanyName}.com`;
}

// Helper function to generate a secure password in the format "Aadil@123"
function generatePassword(managerName: string, registrationNumber: string): string {
  const symbols = '!@#$%^&*';
  const digits = '0123456789';
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const randomDigit = digits[Math.floor(Math.random() * digits.length)];
  const capitalizedName = managerName.charAt(0).toUpperCase();  // Capital first letter
  const lowercasePart = managerName.slice(1, 6).toLowerCase();  // Next few lowercase letters
  const lastThreeDigits = registrationNumber.slice(-3);  // Last 3 digits for more randomness

  // Construct a password like "Aadi@123"
  return `${capitalizedName}${lowercasePart}${randomSymbol}${randomDigit}${lastThreeDigits}`;
}

// Main function to generate manager credentials
export default function generateManagerCredentials(companyName: string, companyRegistrationNumber: string, managerName: string): { managerCredentials: ManagerCredentials } {
  const email = formatEmail(companyName, managerName);
  const password = generatePassword(managerName, companyRegistrationNumber);

  return {
    managerCredentials: {
      companyName,
      companyRegistrationNumber,
      email,
      password,
    }
  };
}

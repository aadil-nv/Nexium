interface ManagerCredentials {
  companyName: string;
  email: string;
  password: string;
}

// Helper function to format email
function formatEmail(managerName: string, companyName: string, managerId: string): string {
  const formattedCompanyName = companyName.toLowerCase().replace(/\s+/g, '');
  const formattedManagerName = managerName.toLowerCase().replace(/\s+/g, '').slice(0, 3); // First 3 letters of manager name
  const formattedManagerId = managerId.slice(0, 3); // First 3 characters of managerId
  return `${formattedManagerName}.${formattedCompanyName}${formattedManagerId}@gmail.com`;
}

// Helper function to generate a password
function generatePassword(managerName: string, companyName: string, managerId: string): string {
  const capitalizedManagerName = managerName.charAt(0).toUpperCase(); // Capital first letter
  const lowercaseNamePart = managerName.slice(1, 3).toLowerCase();   // Next 2 lowercase letters
  const formattedCompanyName = companyName.toLowerCase().replace(/\s+/g, '');
  const formattedManagerId = managerId.slice(0, 3); // First 3 characters of managerId

  // Construct password like "Aadnike@b45"
  return `${capitalizedManagerName}${lowercaseNamePart}${formattedCompanyName}@${formattedManagerId}`;
}

// Main function to generate manager credentials
export default function generateManagerCredentials(
  companyName: string,
  managerName: string,
  managerId: string
): { managerCredentials: ManagerCredentials } {
  const email = formatEmail(managerName, companyName, managerId);
  const password = generatePassword(managerName, companyName, managerId);

  return {
    managerCredentials: {
      companyName,
      email,
      password,
    }
  };
}

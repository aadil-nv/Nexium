import  FeaturesLeave from '../../../assets/landingPageAssets/leavemgmt.png';
import FeaturesDatabase from '../../../assets/landingPageAssets/Human-Resources-square-ezgif.com-webp-to-png-converter.png'; 
import FeaturesOnboarding from '../../../assets/landingPageAssets/Onboarding-ezgif.com-webp-to-png-converter.png'; 

export default function Features() {
  const featuresList = [
    {
      title: "Leave Management",
      description: "Streamline leave requests and approvals, track leave balances, and manage leave policies efficiently.",
      image: FeaturesLeave,
      details: "Our Leave Management system automates the entire leave application process, allowing employees to submit requests easily and managers to approve them with just a few clicks. This reduces paperwork, minimizes errors, and ensures that your company remains compliant with labor laws.",
    },
    {
      title: "Employee Management",
      description: "Manage employee records, onboarding, and offboarding processes seamlessly.",
      image: FeaturesDatabase,
      details: "With our Employee Management feature, you can maintain comprehensive employee profiles, track performance evaluations, and manage training programs. The onboarding process becomes smoother, ensuring that new hires have everything they need to succeed from day one.",
    },
    {
      title: "Payroll Management",
      description: "Automate payroll calculations, deductions, and payments to ensure timely compensation for employees.",
      image: FeaturesOnboarding,
      details: "Our Payroll Management system guarantees accurate and timely payments to employees. It automatically calculates taxes, deductions, and bonuses, while generating detailed reports for your accounting team. You can also integrate with various payment systems to streamline the process further.",
    },
  ];

  return (
    <div className="py-32 md:px-14 px-4 max-w-screen-2xl mx-auto"> 
      <div className="flex flex-col lg:flex-row items-start">
        
        <div className="lg:w-2/3 space-y-8 lg:pr-10"> 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> 
            {featuresList.map((feature, index) => (
              <div 
                key={index} 
                className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl duration-300 p-4 flex flex-col`} // Changed to flex column
              >
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-32 object-cover transition-opacity duration-300 hover:opacity-70" 
                />
                <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{feature.title}</h4> {/* Added dark mode text color */}
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p> {/* Added dark mode text color */}
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">{feature.details}</p> {/* Additional details for each feature */}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Heading and Description */}
        <div className="lg:w-1/3 mb-10 lg:mb-0 lg:flex lg:flex-col lg:justify-center lg:items-start"> {/* Centered content */}
          <h3 className="text-3xl font-bold text-primary mb-4 dark:text-white">
            Key Features of HRMS
          </h3>

          <p className="text-base text-tertiary dark:text-gray-400 mb-4">
            Discover the outstanding features that make our platform the best
            choice for you. We prioritize user experience and performance,
            ensuring that you get the most out of our services.
          </p>

          <p className="text-base text-tertiary dark:text-gray-400 mb-4">
            Our HR Management System is designed to simplify and streamline various HR processes. From managing employee records to automating payroll and leave requests, we aim to enhance productivity and efficiency in your organization.
          </p>

          <p className="text-base text-tertiary dark:text-gray-400">
            Explore each feature to understand how it can benefit your business and improve employee satisfaction.
          </p>
        </div>
      </div>
    </div>
  );
}

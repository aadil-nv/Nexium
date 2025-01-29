import images from '../../../images/images';
import { useTheme } from './theme-provider'; // Ensure this is the correct path to your theme provider

export default function Home() {
  const { theme } = useTheme(); // Get the current theme

  return (
    <div className='md:px-8 p-6 max-w-screen-2xl mx-auto mt-8 flex flex-col md:flex-row items-center'>
      {/* Left Side - Text and Buttons */}
      <div className='md:w-1/2 space-y-4 md:space-y-6 flex flex-col justify-center mt-8 md:mt-12 px-4 md:px-10'> {/* Adjusted space-y and margin */}
        <h2 className={`text-2xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black-800'} mb-2`}> {/* Further decreased font size for smaller screens */}
          Welcome to HRMS Management
        </h2>
        <p className={`text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}> {/* Decreased paragraph text size */}
          Streamline your HR processes with our intuitive and powerful HR Management System. Designed for businesses of all sizes, our platform simplifies employee management, recruitment, payroll, and performance tracking. 
          Empower your HR team to focus on what truly matters—your people.
        </p>
        <div className='flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4'>
          <button className='bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 text-sm md:text-base'>
            <a href="/superadmin-login">Get started</a>
          </button>
          <button className='border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300 text-sm md:text-base'>
            Learn More
          </button>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className='md:w-1/2 mt-6 md:mt-0 flex justify-center items-center'> {/* Centered image vertically */}
        <img
          src={images.homePicture}
          alt="HR Management"
          className={`max-w-full h-auto rounded-md shadow-lg transition-all duration-300 max-h-[500px]`} // Adjusted max-height
        />
      </div>
    </div>
  );
}

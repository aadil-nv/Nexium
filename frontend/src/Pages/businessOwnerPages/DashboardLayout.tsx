import React from 'react'
import { Link } from 'react-router-dom'
import Images from "../../images/images"
import BusinessOwnerNavbar from '../../components/businessOwner/BusinessOwnerNavbar'

export default function DashboardLayout() {
  return (
    <div className=' flex h-screee h-[100vh]'>
        {/* left */}
        <div className='w-[14%] nd:w-[8%] lg:w-[16%] xl:w-[14%] bg-gray-300 p-4'>
            <Link to='/samplepage' className='flex items-center justify-center lg:justify-start gap-2'>
            <img src={Images.LogoOnly} alt="" width={32} height={32} />
            <span className='hidden lg:block text-blue-500'>Nexium</span>
            </Link>

            <BusinessOwnerNavbar/>

        </div>
        {/* Right */}
        <div className='w-[86%] md:w-[92%] lg:[84%] xl:w-[86%] bg-gray-400'>R</div>
      
    </div>
  )
}

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveMenu } from '../../features/menuSlice';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaUserCircle, FaBullhorn, FaBell } from 'react-icons/fa';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { CgProfile } from "react-icons/cg";
import { TfiAnnouncement } from "react-icons/tfi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiNotification3Line } from "react-icons/ri";
import { BsChatLeft } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";


export default function Navbar() {
  const dispatch = useDispatch();
  const activeMenuState = useSelector((state: { menu: { activeMenu: boolean } }) => state.menu.activeMenu);

  const NavButton = ({
    title,
    customFunc,
    icon,
    color,
    dotColor,
  }: {
    title: string;
    customFunc: () => void;
    icon: React.ReactElement;
    color: string;
    dotColor?: string;
  }) => (
    <TooltipComponent content={title} position='BottomCenter'>
      <button
        type='button'
        onClick={customFunc}
        style={{ color }}
        className='relative text-xl rounded-full p-3 hover:bg-gray-300' // Light gray hover effect
      >
        {dotColor && (
          <span
            style={{ background: dotColor }}
            className='absolute inline-flex rounded-full h-2 w-2 right-2 top-2'
          ></span>
        )}
        {icon}
      </button>
    </TooltipComponent>
  );

  return (
    <div
      className={`flex items-center justify-between p-2 h-16 bg-gray-200 text-gray-800 shadow-md fixed top-0 z-50 transition-all duration-300 ease-in-out ${
        activeMenuState ? 'w-[calc(100%-250px)]' : 'w-full'
      }`}
    >
      {/* Left: Menu button */}
      <NavButton
        title='Menu'
        customFunc={() => dispatch(setActiveMenu(!activeMenuState))}
        color='blue' // Icon color
        icon={<AiOutlineMenu />}
        // dotColor='red'
      />

      {/* Right: Profile, Notifications, and Announcements */}
      <div className='flex items-center space-x-4'>
        {/* Announcement Icon */}
        <NavButton
          title='Announcements'
          customFunc={() => console.log('Announcements clicked')}
          color='blue' // Icon color
          icon={<BsChatLeft />}
          // dotColor='yellow'
        />
        {/* Notification Icon */}
        <NavButton
          title='Notifications'
          customFunc={() => console.log('Notifications clicked')}
          color='blue' // Icon color
          icon={<RiNotification3Line />}
          // dotColor='red'
        />
        
       
        <TooltipComponent  content={'Logout'} position={'BottomCenter'}>
          <div>
            <button type='button' className='flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg' onClick={() => console.log('Logout clicked')}>
              <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt=""  className='rounded-full w-8 h-8'/>
              <p>
                <span className='text-gray-400 text-14'>Hi</span>{''}
                <span className='text-gray-400 font-bold ml-1 text-14'>Admin</span>
              </p>
              <MdKeyboardArrowDown  className='text-gray-400 text-14'/>
            </button>
          </div>

        </TooltipComponent>
      </div>
    </div>
  );
}

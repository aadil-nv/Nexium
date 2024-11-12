import React, { useState } from 'react';
import ProfileCard from '../global/ProfileCard';
import PersonalDetails from '../global/PersonalDetailes';
import Address from '../global/Address';
import Documents from '../global/Documents';
import PasswordChange from '../global/Securitie';
import { Box } from '@mui/material';

export default function Profile() {
  const [activeSection, setActiveSection] = useState('personaldetails'); // Default section to display

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <Box sx={{
      padding: { xs: 2, sm: 3 },
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      height: '100vh',
      width: '100%',
      justifyContent: 'space-between',
      overflowY: 'auto', // Enable vertical scroll
    }}>
      {/* Left Side: Profile Card */}
      <Box sx={{
        flex: 1,
        mb: { xs: 3, sm: 0 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
        <ProfileCard handleSectionChange={handleSectionChange} />
      </Box>

      {/* Right Side: Active Section */}
      <Box sx={{
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto', // Ensure scrolling
        maxHeight: '100vh',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
        {activeSection === 'personaldetails' && <PersonalDetails />}
        {activeSection === 'address' && <Address />}
        {activeSection === 'documents' && <Documents />}
        {activeSection === 'passwordchange' && <PasswordChange />}
      </Box>
    </Box>
  );
}

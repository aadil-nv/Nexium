import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Avatar, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

const ImageUpload = ({ onChange }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      style={{ display: 'none' }}
      id="image-upload"
    />
  );
};

const PersonalDetails = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [registrationNumber, setRegistrationNumber] = useState('REG-12345');
  const [companyLogo, setCompanyLogo] = useState('https://example.com/default-logo.png');
  const [profileImage, setProfileImage] = useState('https://example.com/default-avatar.png');
  const [website, setWebsite] = useState('www.johndoe.com');
  const [isEditing, setIsEditing] = useState(false);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfileImage(reader.result as string);
        } else if (type === 'logo') {
          setCompanyLogo(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f4f6f9', borderRadius: '10px', height: '100%' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ maxWidth: 800, margin: '0 auto', boxShadow: 3, height: '621px' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            {/* Image Upload Section - Horizontally Aligned */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }} mb={3}>
              {/* Profile Image with Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Avatar
                  src={profileImage}
                  sx={{ width: 120, height: 120, mb: 2, border: '4px solid #1976d2' }}
                />
                <label htmlFor="image-upload">
                  <Button variant="contained" component="span" sx={{ width: '100%' }}>
                    {isEditing ? 'Change Profile Picture' : 'Profile Picture'}
                  </Button>
                </label>
                <ImageUpload onChange={(e) => handleImageChange(e, 'profile')} />
              </motion.div>

              {/* Company Logo with Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Avatar
                  src={companyLogo}
                  sx={{ width: 100, height: 100, mb: 2, border: '4px solid #1976d2' }}
                />
                <label htmlFor="logo-upload">
                  <Button variant="contained" component="span" sx={{ width: '100%' }}>
                    {isEditing ? 'Change Company Logo' : 'Company Logo'}
                  </Button>
                </label>
                <ImageUpload onChange={(e) => handleImageChange(e, 'logo')} />
              </motion.div>
            </Box>

            {/* Personal Information Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            >
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Registration Number"
                variant="outlined"
                fullWidth
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Website"
                variant="outlined"
                fullWidth
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />

              {/* Edit/Save Button */}
              <Button
                variant="contained"
                onClick={() => setIsEditing(!isEditing)}
                sx={{ mt: 2 }}
              >
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default PersonalDetails;

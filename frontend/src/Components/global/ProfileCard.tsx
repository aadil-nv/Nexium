import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Button } from '@mui/material';
import { motion } from 'framer-motion'; // Import framer-motion for animation
import { useTheme } from '@mui/material/styles'; // To use the themeColor

interface ProfileCardProps {
  handleSectionChange: (section: string) => void; // Define the prop type
}

const ProfileCard = ({ handleSectionChange }: ProfileCardProps) => {
  const { palette } = useTheme();

  return (
    <Card sx={{ width: '100%', height: '600px', mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src="https://example.com/profile-image.png"
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h6">FreshFusion Inc.</Typography>
          <Typography variant="body2" color="textSecondary">
            freshfusion22@freshfusion.com
          </Typography>
          <Typography variant="body2" color="textSecondary">
            555-901-2345
          </Typography>

          {/* Animated Buttons below the Profile Card */}
          <Box sx={{ marginTop: 2 }}>
            {['Personal Info', 'Address', 'Documents', 'Password Change'].map((label, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, type: 'spring', stiffness: 100 }}
              >
                <Button
                  variant="contained"
                  sx={{
                    mb: 1, 
                    width: '100%', 
                    backgroundColor: palette.primary.main, // Use theme primary color
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: palette.primary.dark, // Darker hover color
                    },
                  }}
                  onClick={() => handleSectionChange(label.toLowerCase().replace(' ', ''))} // Update active section based on the label
                >
                  {label}
                </Button>
              </motion.div>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;

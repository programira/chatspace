import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import appImage from '../../assets/bck4-transformed.png'; // Path to your generated app PNG
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'; 

interface LoginProps {
    onLogin: () => void;
  }
  
  const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [name, setName] = useState('');
  
    const handleLogin = () => {
      if (name.trim()) {
        onLogin();
      }
    };
  
    return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh', // Full viewport height
            width: '100vw', // Full viewport width
            background: 'linear-gradient(-45deg, #000000, #0d0829, #32064a, #04645a)',
            backgroundSize: '400% 400%',
            animation: 'moveAurora 15s ease infinite', // Animate background
            '@keyframes moveAurora': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
            position: 'relative', // Enable stacking for the login box and image
          }}
        >
          {/* Generated App Image Behind the Login Box */}
          <Box
            component="img"
            src={appImage}
            alt="App Design"
            sx={{
              position: 'absolute',
              width: '700px', // Increased size
              height: 'auto',
              top: '45%',
              left: '50%',
              transform: 'translate(-50%, -50%)', // Center behind the login box
              // opacity: 0.3, // Subtle appearance to blend with the background
              zIndex: 1, // Behind the login box
            }}
          />
    
          {/* Login Box */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '250px',
              padding: 4,
              // borderRadius: 2,
              // boxShadow: 3,
              // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
              zIndex: 2, // Ensure it's above the image
            }}
          >
            {/* <Typography variant="h5" align="center">
              ChatSpace Login
            </Typography> */}
            {/* Name Input Field */}
            {/* Input Field and Rocket Button Next to Each Other */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1, // Space between input and button
          }}
        >
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{
              backgroundColor: '#f9f9f9', // Pale background color
              borderRadius: 1, // Rounded corners
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{
              minWidth: '50px', // Smaller width for the button
              padding: '16px', // Adjust padding for a circular look
            }}
          >
            <RocketLaunchIcon /> {/* Only the rocket icon */}
          </Button>
        </Box>
          </Box>
        </Box>
      );
    };
    
    export default Login;
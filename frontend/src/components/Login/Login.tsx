import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import appImage from '../../assets/bck4-transformed.png'; // Path to your generated app PNG
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice'; // Action to set user
import { AppDispatch } from '../../store'; // Type for dispatch
import { createUser, fetchParticipantByUserId } from '../../services/userService';
import { sendWebSocketMessage } from '../../store/webSocketSlice';

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
	const [name, setName] = useState('');
	const dispatch = useDispatch<AppDispatch>();

	const handleLogin = async () => {
		if (!name.trim()) return;

		try {
			// Call the API to create the user
			const user = await createUser(name);
			// Fetch or create the Participant for this user
			let participant = await fetchParticipantByUserId(user.id);
			console.log('participant', participant);

			// If no participant exists, create a new one on the frontend before sending WebSocket message
			if (!participant) {
				participant = {
					id: user.id, // Temporary ID until assigned in DB
					userId: user.id,
					isActive: true,
					joinedAt: new Date().toISOString(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
					user: { id: user.id, name: user.name }, // Include user info
				};
			}

			// Update Redux store with the logged-in user
			dispatch(setUser(user));

			console.log('sending login message', user.id, user.name);
			dispatch(sendWebSocketMessage('login', { userId: user.id, name: user.name, createdAt: user.createdAt, updatedAt: user.updatedAt }));

			// Trigger the onLogin callback to navigate to the chat
			onLogin();
		} catch (error) {
			console.error('Login error:', error);
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
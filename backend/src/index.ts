import express from 'express';
import { createServer } from 'http';
import sequelize from './config/sequelize'; // Import sequelize instance
import { setupSwagger } from './config/swagger';
import messagesRoutes from './routes/messages';
import usersRoutes from './routes/users';
import participantsRoutes from './routes/participants';
import { setupWebSocket } from './websockets';
import cors from 'cors';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from the frontend
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Middleware
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.send('Hello from ChatSpace API!');
});

// Setup Swagger Documentation
setupSwagger(app);

// Main initialization
(async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync the database
    await sequelize.sync({ alter: true }); // Use `alter: true` to auto-update tables based on model changes
    console.log('Database synchronized.');

    // Register API routes
    app.use('/api/users', usersRoutes);
    app.use('/api/messages', messagesRoutes);
    app.use('/api/participants', participantsRoutes);

    // Start HTTP server
    const server = createServer(app);

    // Optional: Initialize WebSocket (if needed)
    setupWebSocket(server);

    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Error during app initialization:', error);
    process.exit(1); // Exit the process if initialization fails
  }
})();

const http = require('http');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const app = require('./app');
const registerSocketHandlers = require('./sockets/socketHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.io with CORS
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ['GET', 'POST'],
    },
});

// Register socket handlers
registerSocketHandlers(io);

// Start server
server.listen(PORT, () => {
    console.log(`🚀 SphereTest server running on port ${PORT}`);
});


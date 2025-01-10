const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
require('dotenv').config(); // Load .env variables
dotenv.config();

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins (for testing, replace with specific domain in production)
        methods: ['GET', 'POST'],
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define routes for users and messages
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

io.on("connection", (socket) => {
    console.log("New client connected");

    // Handle user joining a room
    const { userId } = socket.handshake.query;
    if (userId) {
        socket.join(userId);  // Join the room based on userId
        console.log(`User ${userId} joined their room`);
    }

    // Handle joining a room (via "joinRoom" event)
    socket.on("joinRoom", ({ userId }) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    // Handle sending a message
    socket.on("sendMessage", async (message) => {
        const { senderId, receiverId, messageContent } = message;

        if (!senderId || !receiverId || !messageContent) {
            console.log('Error: Missing required fields');
            return;
        }

        // Save the message to the database
        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            message: messageContent,
        });
        await newMessage.save();

        // Emit the message to the receiver's room
        io.to(receiverId).emit("receiveMessage", newMessage);
        console.log(`Message sent to user ${receiverId}:`, newMessage);
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Define the port to listen on
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// importing required packages
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';

import connectDB from '../config/db.js';
import { setupSocket } from '../config/socket.js';

// Importing routes
import chatRoutes from '../routes/chatRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import documentRoutes from '../routes/documentRoutes.js';
import roomRoutes from '../routes/roomRoutes.js';



// configuring dotenv
dotenv.config();
const port = process.env.PORT || 3001;

connectDB();

const app = express()
const server = http.createServer(app);
const io = setupSocket(server);

// middlewares
app.use(express.json());
app.use(cors())
app.use('/api', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/rooms', roomRoutes);
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use(express.static('public'));
app.use(cors({
    origin: ['https://real-time-collab-peach.vercel.app',],
    credentials: true,
}));

// default route
app.get('/', (req, res) => {
    res.send("gurrakha ");
})


server.listen(port, () => {
    console.log(`RealTimeCollaboration app is listening on port ${port}`)
})

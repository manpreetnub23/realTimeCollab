// importing required packages
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const http = require('http')
const connectDB = require('./config/db')
const { setupSocket } = require('./config/socket')

// importing routes
const chatRoutes = require('./routes/chatRoutes')
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes')

// configuring dotenv
dotenv.config();
const port = process.env.PORT;

connectDB();

const app = express()
const server = http.createServer(app);

// middlewares
app.use(express.json());
app.use(cors())
app.use('/api', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use(express.static('public'));

// socket.io
setupSocket(server);

server.listen(port, () => {
    console.log(`RealTimeCollaboration app is listening on port ${port}`)
})

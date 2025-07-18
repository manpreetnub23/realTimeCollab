import Room from "../models/RoomModel.js";
import { saveMessage } from '../controllers/chatController.js';
import { Server } from 'socket.io';

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('joinRoom', (roomId) => {
            console.log(`entered in room ${roomId}`);
            socket.join(roomId);
        });

        socket.on('chatMessage', async (data) => {
            try {
                console.log("mera data hai ", data);
                const message = await saveMessage(data);
                io.to(data.roomId).emit('chatMessage', message);
            } catch (error) {
                console.error("Error handling chatMessage:", error);
            }
        });

        socket.on("createRoom", async ({ name, username }) => {
            try {
                const existing = await Room.findOne({ name });
                if (existing) {
                    socket.emit("roomError", "Room already exists");
                    return;
                }

                const newRoom = await Room.create({
                    name,
                    createdBy: username,
                    members: [username],
                });

                socket.join(name);
                io.to(username).emit("newRoom", newRoom);
            } catch (err) {
                console.error("Room creation error:", err);
                socket.emit("roomError", "Server error while creating room");
            }
        });

        socket.on("leave-doc", (docId) => {
            socket.leave(docId);
        });

        socket.on("join-doc", (docId) => {
            socket.join(docId);
        });

        socket.on("send-changes", ({ id, content }) => {
            socket.to(id).emit("receive-changes", content);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
};

// ✅ Export using ES Modules
export { setupSocket };

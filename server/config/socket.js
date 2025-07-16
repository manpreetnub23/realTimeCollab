const { saveMessage } = require('../controllers/chatController');

const setupSocket = (server) => {
    const io = require('socket.io')(server, {
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
                io.to(data.roomId).emit('chatMessage', message); // ✅ FIXED
            } catch (error) {
                console.error("Error handling chatMessage:", error);
            }
        });


        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
        socket.on("join-doc", (docId) => {
            socket.join(docId);
        });

        socket.on("send-changes", ({ id, content }) => {
            socket.to(id).emit("receive-changes", content);
        });

        socket.on("leave-doc", (docId) => {
            socket.leave(docId);
        });
    });
}


module.exports = { setupSocket };

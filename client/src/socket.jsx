import { io } from "socket.io-client";

const socket = io("https://realtimecollab-8.onrender.com/", {
	transports: ["websocket"], // optional: more stable connection
});

export default socket;

import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
	transports: ["websocket"], // optional: more stable connection
});

export default socket;

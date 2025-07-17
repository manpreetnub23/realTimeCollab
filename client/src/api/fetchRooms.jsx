// src/api/roomApi.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/rooms";

// Fetch rooms by username
export const fetchRooms = async (username) => {
	try {
		const res = await axios.get(`${BASE_URL}/${username}`);
		return res.data;
	} catch (err) {
		console.error("Error fetching rooms:", err);
		throw err;
	}
};

// Create a new room
export const createRoom = async (name, username) => {
	try {
		console.log("create room api mein aaya hai kam se kam");
		const res = await axios.post(BASE_URL, { name, username });
		return res.data;
	} catch (err) {
		console.error("Error creating room:", err);
		throw err;
	}
};

// api/fetchRooms.js
export const joinRoomWithCode = async (code, username) => {
	console.log("join room with code mein aaya hai");
	const res = await axios.post(`${BASE_URL}/join`, {
		inviteCode: code,
		username,
	});
	console.log(res);
	return res.data; // This should return { name, inviteCode, _id, etc. }
};

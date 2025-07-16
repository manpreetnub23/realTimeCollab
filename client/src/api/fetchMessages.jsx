import axios from "axios";

export const fetchMessages = async (roomId) => {
	try {
		const res = await axios.get(`http://localhost:3000/api/messages/${roomId}`);
		console.log("res hai : ", res);
		return res.data;
	} catch (err) {
		console.error("❌ Error fetching messages:", err);
		return [];
	}
};

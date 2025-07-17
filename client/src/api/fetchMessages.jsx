import axios from "axios";

export const fetchMessages = async (roomId) => {
	try {
		const res = await axios.get(
			`https://realtimecollab-8.onrender.com/api/messages/${roomId}`
		);
		console.log("res hai : ", res);
		return res.data;
	} catch (err) {
		console.error("❌ Error fetching messages:", err);
		return [];
	}
};

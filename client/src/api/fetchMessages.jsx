import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchMessages = async (roomId, before = null, limit = 50) => {
	try {
		let url = `${BASE_URL}/api/messages/${roomId}?limit=${limit}`;
		if (before) {
			url += `&before=${before}`;
		}
		const res = await axios.get(url);
		return res.data;
	} catch (err) {
		console.error("❌ Error fetching messages:", err);
		return [];
	}
};

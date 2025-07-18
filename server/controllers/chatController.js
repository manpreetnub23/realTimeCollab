import Message from '../models/MessageModel.js';

const saveMessage = async (data) => {
    try {
        console.log("try mein aa agya hai ", data);
        const message = new Message(data);
        await message.save();
        return message;
    } catch (err) {
        console.log("yeh mera error hai ", err);
    }
};

const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        const before = req.query.before;

        const query = { roomId };

        if (before) {
            query.timestamp = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .sort({ timestamp: -1 })
            .limit(limit);

        return res.status(200).json(messages.reverse());
    } catch (err) {
        console.error("Get messages error:", err);
        return res.status(500).json({ error: "Failed to fetch messages", success: false });
    }
};

// ✅ Use ESM export
export { getMessages, saveMessage };

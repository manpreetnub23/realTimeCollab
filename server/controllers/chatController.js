const Message = require('../models/MessageModel');

const saveMessage = async (data) => {
    try {
        console.log("try mein aa agya hai ", data);
        // const { sender, roomId, message } = data;
        const message = new Message(data);
        await message.save();
        return message;
    } catch (err) {
        console.log("yeh mera error hai ", err);
    }
}
const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ roomId }).sort({ timestap: 1 });
        return res.status(200).json(messages); // ✅ Single response
    } catch (err) {
        console.error("Get messages error:", err);
        return res.status(500).json({ error: 'Failed to fetch messages', success: false });
    }
}
module.exports = { getMessages, saveMessage };
import Room from "../models/RoomModel.js";
import { nanoid } from "nanoid";

// GET all rooms where user is a member
const getRoomsByUser = async (req, res) => {
    try {
        const rooms = await Room.find({ members: req.params.username });
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// POST create new room
const createRoom = async (req, res) => {
    const { name, username } = req.body;
    if (!name || !username)
        return res.status(400).json({ error: "Missing fields" });

    try {
        const exists = await Room.findOne({ name });
        if (exists)
            return res.status(409).json({ error: "Room already exists" });

        const inviteCode = nanoid(8);

        const room = await Room.create({
            name,
            createdBy: username,
            members: [username],
            inviteCode,
        });

        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// POST join room with invite code
const joinRoom = async (req, res) => {
    console.log("join room mein aaya hai");
    const { inviteCode, username } = req.body;
    if (!inviteCode || !username)
        return res.status(400).json({ error: "Missing fields" });

    try {
        console.log("backend mein try mein aa gaya hai , invite code hai ", inviteCode);
        const room = await Room.findOne({ inviteCode });
        console.log("find one karne ke baad room mein aaya hai ", room);
        if (!room)
            return res.status(404).json({ error: "Invalid invite code" });

        if (!room.members.includes(username)) {
            room.members.push(username);
            await room.save();
        }

        res.json(room);
    } catch (err) {
        console.error("Join room error:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// ✅ ESM export
export { getRoomsByUser, createRoom, joinRoom };

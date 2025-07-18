import express from 'express';
const router = express.Router();
import {
    getRoomsByUser,
    createRoom,
    joinRoom,
} from "../controllers/roomController.js";

// GET /api/rooms/:username → get rooms user is in
router.get("/:username", getRoomsByUser);

// POST /api/rooms → create new room
router.post("/", createRoom);

// POST /api/rooms/join → join using invite code
router.post("/join", joinRoom);

export default router;

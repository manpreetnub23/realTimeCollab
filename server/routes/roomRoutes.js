const express = require("express");
const router = express.Router();
const {
    getRoomsByUser,
    createRoom,
    joinRoom,
} = require("../controllers/roomController");

// GET /api/rooms/:username → get rooms user is in
router.get("/:username", getRoomsByUser);

// POST /api/rooms → create new room
router.post("/", createRoom);

// POST /api/rooms/join → join using invite code
router.post("/join", joinRoom);

module.exports = router;

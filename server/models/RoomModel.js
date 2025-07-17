const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        createdBy: { type: String, required: true },
        members: [String],
        inviteCode: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);

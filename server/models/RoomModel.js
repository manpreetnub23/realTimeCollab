import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        createdBy: { type: String, required: true },
        members: [String],
        inviteCode: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

const Room = mongoose.model("Room", RoomSchema);
export default Room;
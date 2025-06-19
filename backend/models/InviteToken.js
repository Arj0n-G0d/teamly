import mongoose from "mongoose";

const inviteTokenSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    token: { type: String },
    createdAt: { type: Date, default: Date.now, expires: 600 } // expires in 600 seconds = 10 minutes
});

const inviteTokenModel = mongoose.model("InviteCode", inviteTokenSchema);
export default inviteTokenModel;

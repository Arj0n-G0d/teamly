import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        name: { type: String, required: true, minlength: 2},
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImageUrl: { type: String, default: "" },
        role: { type: String, enum: ["Member", "Admin"], default: "Member" },
        admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;
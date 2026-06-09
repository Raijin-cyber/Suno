import mongoose from "mongoose";

const userConvoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  convoId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
  lastReadAt: {
    type: Date,
    default: null,
  },
  mutedUntil: {
    type: Date,
    default: null,
  },
  pinned: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const UserConversation = mongoose.model("UserConversation", userConvoSchema);
export default UserConversation;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    convoId: {
        type: String,
        required: [true, "message can not exist without conversation"]
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    encryptedText: {
        type: String,
        required: true
    },
    referenceMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message", // points to another message
        default: null,
    },
    IsEdited: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    readByAt: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            readAt: { type: Date, default: Date.now }
        }
    ]
},
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
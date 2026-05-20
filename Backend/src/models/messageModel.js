import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    convoId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Convo",
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
    IsEdited: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    readAt: {
        type: Date,
    }
},
    {
        timestamps: true
    }
)

const Message = mongoose.model("Message", messageSchema);
export default Message;
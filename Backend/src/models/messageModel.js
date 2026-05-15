import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    convoId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Convo",
        required: [true, "message can exist without conversation"]
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
    deliveredAt: {
        type: Date,
        required: true
    },
    readAt: {
        type: Date,
        required: true
    }
},
    {
        timestamps: true
    }
)
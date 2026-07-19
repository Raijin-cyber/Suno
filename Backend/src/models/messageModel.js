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
    isEdited: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    readByAt: {
        type: Map,
        of: new mongoose.Schema(
            {
            readerUsername: { type: String },
            readTime: { type: Date, default: Date.now }
            },
            { _id: false } // don’t generate an _id for each subdocument
        ),
        default: {},
    }
},
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
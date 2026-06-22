import mongoose from "mongoose";

const convoSchema = new mongoose.Schema({
    convoId: {
        type: String,   // fixed typo
        required: true,
        unique: true,
    },
    convoType: {
        type: String,
        enum: ["direct", "group"],
        required: [true, `conversation "type" is required`],
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    lastMessage: {
        encryptedText: String,
        senderId: mongoose.Schema.Types.ObjectId,
        createdAt: Date
    },
    unreadCount: [{
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        count:{
            type:Number,
            default:0
        }
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    avatar: {
        type: String
    }
}, 
    {
        timestamps: true   
    }
);

const Convo = mongoose.model("Convo", convoSchema);
export default Convo;

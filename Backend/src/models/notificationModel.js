import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Without sender ID notification can not be created."]
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Without receiver ID notication can not be created."]
        },
        type: {
            type: String,
            enum: [
                "request",        // friend/group/chat requests
                "message",        // new messages, mentions, replies
                "reminder",       // re-engagement nudges
                "status",         // presence updates (online/offline/typing)
                "receipt",        // delivery/read confirmations
                "system",         // app/account events
                "call",           // voice/video call notifications
                "security",       // warnings, suspicious activity
                "general"         // catch-all or misc notifications
            ],

            required: true
        },
        status: {
            type: String,
            enum: ["unread", "read"],
            default: "unread"
        },
        requestID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Request", // link to your Request model
            required: function () {
                return this.type === "request"; // only required for request-type notifications
            }
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: { expires: "7d" }
        }
    },
    {
        timestamps: true
    }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
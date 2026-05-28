import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true , "Sender ID is required!"]
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: "7d" } // auto-delete after 7 days
    }
},
{
    timestamps: true,
}
)

const Request = mongoose.model("Request", requestSchema);
export default Request;
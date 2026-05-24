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
    }

},
{
    timestamps: true,
}
)

const Request = mongoose.model("Request", requestSchema);
export default Request;
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
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, 
    {
        timestamps: true   
    }
);

const Convo = mongoose.model("Convo", convoSchema);
export default Convo;

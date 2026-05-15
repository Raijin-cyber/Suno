import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required!"],
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
    },
    publicKey: {
        type: String,
        required: true,
    },
    blockedUser: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
    }
},
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
export default User;
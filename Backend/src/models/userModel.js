import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    auth: {
        type: String,
        enum: ["native", "google", "github", "facebook", "apple", "twitter"],
        required: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true,
    },
    avatar: {
        type: String,
        default: null,
    },
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
        required: function () {
            return this.auth === "native"; // only required for native login
        },
    },
    name: {
        type: String
    },
    bio: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    publicKey: {
        type: String,
        default: null,
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
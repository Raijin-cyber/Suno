import Convo from "../models/convoModel.js";
import User from "../models/userModel.js";
import Request from "../models/requestModel.js";
import UserConversation from "../models/userConversationModel.js";
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "../utilities/asyncHandler.js";

//@desc creates a new conversation
//@route " POST /api/v1/convo/create"
//@access private
const createConvo = asyncHandler(async(req, res, next) => {
    // userA is the user itself and userB is the requested user with whom userA wants to create a conversation
    const {convoType, userB_ID, participants_ID} = req.body;
    const userA_ID = req.cookies.userA_ID;

    console.log(userA_ID, userB_ID);

    if(convoType === "direct") {
        if(!userA_ID || !userB_ID) {
            res.status(400);
            throw new Error("Bad Request: Both participants are required!");
        }

        const userA = await User.findById(userA_ID);
        const userB = await User.findById(userB_ID);

        if(!userA || !userB) {
            res.status(400);
            throw new Error("Bad Request: Either of the users do not exists.");
        }

        // check if blocked
        const blockedUserList = [...userA.blockedUser, ...userB.blockedUser];
        if(blockedUserList.some(id => id.toString() === userB_ID)) {
            res.status(403);
            throw new Error("You cannot perform this operation because user is blocked");
        }

        // do a check if a accepted request model exist or not
        const acceptedRequest = await Request.find(
            {status: "accepted",
            $or: [
                {sender: userA_ID, receiver: userB_ID},
                {sender: userB_ID, receiver: userA_ID}
            ]
        });

        if (!acceptedRequest) {
            res.status(403);
            throw new Error("Conversation cannot be created: request is not accepted.");
        } 

        // deterministic convoId
        const convoID = [userA_ID.toString(), userB_ID.toString()].sort().join('_');

        // atomic upsert
        const convo = await Convo.findOneAndUpdate(
            { convoId: convoID },
            { $setOnInsert: { convoId: convoID, convoType: "direct", members: [userA_ID, userB_ID] } },
            { new: true, upsert: true }
        );

        const userConvos = [userA_ID, userB_ID].map(uid => ({
            userId: uid,
            convoId: convo.convoId,
            role: "member",
            lastReadAt: null,
            mutedUntil: null,
            pinned: false
        }));

        await UserConversation.insertMany(userConvos, { ordered: false });

        res.status(200);
        res.json({
            success: true,
            message: "Conversation created or retrieved successfully",
            conversation: convo
        });
    }
    else if(convoType === "group") {
        if (!Array.isArray(participants_ID)) {
            res.status(400);
            throw new Error("Invalid data type for participants ID.");
        }

        const convoID = uuidv4();
        const convo = await Convo.create(
            {
                convoId: convoID,
                convoType: "group",
                members: participants_ID,
                admin: userA_ID
            }
        );

        const userConvos = participants_ID.map(uid => ({
            userId: uid,
            convoId: convo.convoId,
            role: uid === userA_ID ? "admin" : "member",
            lastReadAt: null,
            mutedUntil: null,
            pinned: false
        }));

        await UserConversation.insertMany(userConvos);

        res.status(200);
        res.json({
            success: true,
            message: "Successfully created a group",
            result: convo,
        });
    }
    else {
        res.status(400);
        throw new Error("conversation type is required. Please specify 'direct' or 'group'.");
    }
});

//@desc get all user's conversation
//@route " POST /api/v1/convo/get"
//@access private
const getAllConvo = asyncHandler(async(req, res, next) => {    
    const userA_ID = req.cookies.userA_ID;

    if(!userA_ID) {
        res.status(400);
        throw new Error("Bad Request: User ID is missing.");
    }

    const conversations = await Convo.find(
        { members: userA_ID },
        {
            convoType: 1,
            convoId: 1,
            members: 1,
            lastMessage: 1,
            unreadCount: 1,
            avatar: 1
        }
    )
    .populate({
        path: "members",
        select: "username avatar"
    })
    .populate({
        path: "lastMessage",
        select: "encryptedText readByAt createdAt senderId"
    }).sort({ updatedAt: -1 });

    if(!conversations) {
        res.status(404);
        throw new Error("There are no conversations with users.");
    }

    res.status(200);
    res.json(
        {
            status: "conversations fetched successfully",
            conversations: conversations,
        }
    );

});

//@desc updates an existing conversation
//@route " POST /api/v1/convo/update"
//@access private
const updateConvo = asyncHandler(async (req, res, next) => {
    const update = req.body;

    if (!update || Object.keys(update).length === 0) {
        res.status(400);
        throw new Error("Bad Request: Update object is missing.");
    }

    const { membersToAdd, membersToRemove, AdminRole } = update;

    // Find the conversation by ID from params
    const convo = await Convo.findById(req.params.id);
    if (!convo) {
        res.status(404);
        throw new Error("Conversation not found.");
    }

    // Add members (avoid duplicates)
    if (membersToAdd && membersToAdd.length > 0) {
        convo.members.push(...membersToAdd);
        convo.members = [...new Set(convo.members.map(m => m.toString()))]; // ensure uniqueness
    }

    // Remove members
    if (membersToRemove && membersToRemove.length > 0) {
        convo.members = convo.members.filter(
            member => !membersToRemove.includes(member.toString())
        );
    }

    // Update admin role
    if (AdminRole) {
        convo.admin = AdminRole;
    }

    const updatedConvo = await convo.save();

    res.status(200).json({
        success: true,
        message: "Conversation updated successfully.",
        result: {
            _id: updatedConvo._id,
            convoId: updatedConvo.convoId,
            convoType: updatedConvo.convoType,
            members: updatedConvo.members,
            admin: updatedConvo.admin
        }
    });
});      

//@desc deletes a conversation
//@route " POST /api/v1/convo/delete"
//@access private
const deleteConvo = asyncHandler(async (req, res, next) => {
    const convo = await Convo.findById(req.params.id);
    if (!convo) {
        res.status(404);
        throw new Error("Conversation not found.");
    }

    const userId = req.user._id; // assuming you attach user info from auth middleware

    if (convo.convoType === "group") {
        // Only admin can delete
        if (convo.admin.toString() !== userId.toString()) {
            res.status(403);
            throw new Error("Forbidden: Only admin can delete this group conversation.");
        }
    } else if (convo.convoType === "direct") {
        // Either member can delete
        if (!convo.members.some(m => m.toString() === userId.toString())) {
            res.status(403);
            throw new Error("Forbidden: Only members can delete this direct conversation.");
        }
    }

    await convo.deleteOne();

    res.status(200).json({
        success: true,
        message: "Conversation deleted successfully."
    });
});

export {
    createConvo,
    getAllConvo,
    updateConvo,
    deleteConvo
};
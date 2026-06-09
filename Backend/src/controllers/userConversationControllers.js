import asyncHandler from "../utilities/asyncHandler.js";
import UserConversation from "../models/userConversationModel.js";

const fetchUserConversationDetails = asyncHandler(async(req, res, next) => {
    const { userId, convoId } = req.params;

    if(!userId || !convoId) {
        res.status(400);
        throw new Error("User ID or conversation ID is missing.");
    }

    const userConvo = await UserConversation.findOne(
        {   
            userId: userId,
            convoId: convoId,
        }
    )

    if (!userConvo) {
        res.status(404);
        throw new Error("User conversation metadata not found.");
    }

    res.status(200);
    res.json({
        success: true,
        message: "User conversation meta data fetched successfully.",
        userConvo: userConvo
    })
})


const updateUserConversationDetails = asyncHandler(async(req, res, next) => {
    const { userId, convoId } = req.params;
    const { role, lastReadAt, mutedUntil, pinned } = req.body;
    
    if(!userId || !convoId) {
        res.status(400);
        throw new Error("User ID or conversation ID is missing.");
    }

    if (role === undefined && lastReadAt === undefined && mutedUntil === undefined && pinned === undefined) {
        res.status(400);
        throw new Error("Payload data is missing.");
    }

    const userConvo = await UserConversation.findOne(
        {
            userId: userId,
            convoId: convoId,
        }
    )

    if (!userConvo) {
        res.status(404);
        throw new Error("User conversation metadata not found.");
    }

    userConvo.role = role ?? userConvo.role;
    userConvo.lastReadAt = lastReadAt ?? userConvo.lastReadAt;
    userConvo.mutedUntil = mutedUntil ?? userConvo.mutedUntil;
    userConvo.pinned = pinned ?? userConvo.pinned;


    const newUserConvo = await userConvo.save()

    res.status(200);
    res.json({
        success: true,
        message: "User conversation meta data fetched successfully.",
    })

})

export {
    fetchUserConversationDetails,
    updateUserConversationDetails
}
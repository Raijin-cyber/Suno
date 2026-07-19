import asyncHandler from "../utilities/asyncHandler.js";
import Message from "../models/messageModel.js";
import mongoose from "mongoose";
import Convo from "../models/convoModel.js";

//@desc creates a new message
//@route " POST /api/v1/message/:id/create"
//@access private
const createMessage = asyncHandler(async (req, res, next) => {
    const { encryptedMessage, referenceMessageId } = req.body;
    const convoId = req.params.id;
    const senderId = req.cookies.userA_ID;

    if (!encryptedMessage) {
        res.status(400);
        throw new Error("Bad Request: Message text is required.");
    }

    if(!convoId || !senderId) {
        res.status(400);
        throw new Error("Bad Request: User credentials are missing.");
    }

    const newMessage = await Message.create({
        convoId: convoId,
        senderId: senderId,
        encryptedText: encryptedMessage,
        referenceMessage: referenceMessageId || null,
    });

    if (!newMessage) {
        res.status(500);
        throw new Error("Failed to create a message. Try again later.");
    }

    const convo = await Convo.findOneAndUpdate({ convoId: convoId }, 
        { lastMessage: 
            { 
                encryptedText: encryptedMessage, 
                senderId: senderId,
                createdAt: newMessage.createdAt, 
            } 
        }, 
        { 
            returnDocument: "after" 
        }
    );

    res.status(201);
    res.json({
        success: true,
        message: "Message created successfully",
        result: newMessage
    });
});

//@desc get messages: if last message Id is provided-> fetch from that ID otherwise fetch last 20
//@route " POST /api/v1/message/:id/get"
//@access private
const getMessage = asyncHandler(async (req, res) => {
    const convoId = req.params.id;
    const { lastMessageId } = req.query; // cursor
    const limit = parseInt(req.query.limit) || 20;

    if(!convoId) {
        res.status(400);
        throw new Error("Conversation is missing.");
    }

    let filter = { convoId };

    if (lastMessageId && mongoose.Types.ObjectId.isValid(lastMessageId)) {
        filter._id = { $lt: new mongoose.Types.ObjectId(lastMessageId) };
    }

    const messages = await Message.find(filter)
        .sort({ createdAt: -1 }) // newest first
        .limit(limit)
        .populate({
            path: "senderId",
            select: "username",
        })
        .populate({
            path: "referenceMessage",
            select: "encryptedText senderId",
            populate: {
                path: "senderId",
                select: "username",
            },
        });

    if(!messages) {
        throw(404);
        throw new Error("There are no messages for this conversation!");
    }

    messages.reverse(); // reverse the order

    res.status(200);
    res.json({
        success: true,
        messages
    });
});

//@desc get messages
//@route " GET /api/v1/message/:id/unrd-msg"
//@access private
const fetchUnreadMessage = asyncHandler(async(req, res, next) => {
    const convoId = req.params.id;
    const { userA_ID } = req.cookies;

    // check for valid credentials
    if(!convoId || !userA_ID) {
        res.status(400);
        throw new Error("Bad Request: convoId and userId are required.");
    }

    const unreadMessages = await Message.find({
        convoId,
        [`readByAt.${userA_ID}`]: { $exists: false }
    })
    .sort({ createdAt: -1 })
    .populate("senderId", "username") // still needed for sender info
    .populate({
        path: "referenceMessage",
        select: "encryptedText senderId",
        populate: { path: "senderId", select: "username" }
    });


    if(unreadMessages.length === 0) {
        res.status(200);
        res.json({
            success: true,
            message: "There are no unread messages",
        });
    }

    res.status(200);
    res.json({
        success: true,
        message: "unread messaeges fetched successfully.",
        unreadMessages: unreadMessages,
    });

});

//@desc mark mesages as read
//@route " PATCH /api/v1/message/mark-read"
//@access private
const markAsReadMessage = asyncHandler(async(req, res, next) => {
    const { messageId, readerId, readerUsername, readTime } = req.body;

    // check for required Data
    if( !messageId || !readerId || !readTime ) {
        res.status(400);
        throw new Error("Bad Request: messageId, readerId, readTime are required");
    }

    const targetMessage = await Message.findByIdAndUpdate(
        messageId,
        {
            $set: {
                [`readByAt.${readerId}`]: {
                    readerUsername,
                    readTime: readTime || new Date()
                }
            }
        },
        { new: true }
    );

    if (!targetMessage) {
        res.status(404);
        throw new Error("Message not found");
    }

    res.status(200);
    res.json({
        success: true,
        message: "Message marked as read",
        data: targetMessage
    });
});
 
//@desc update an existing message
//@route " POST /api/v1/message/:id/update/:msgId"
//@access private
const updateMessage = asyncHandler(async(req, res, next) => {
    const { newEncryptedMessage } = req.body;
    const convoId = req.params.id;
    const msgId = req.params.mesgId;

    if(!newEncryptedMessage || newEncryptedMessage.trim() === '') {
        res.status(400);
        throw new Error("Bad Request: Updated message content is required.");
    }

    const message = await Message.findById(msgId);

    if(!message) {
        res.status(404);
        throw new Error("Bad Request: Requested message was not found.");
    }

    // allowing edits only within 5 minutes of time period after the creation of a message
    const now = new Date();
    const diffMinutes = (now - message.createdAt) / (1000 * 60);

    if(diffMinutes > 5) {
        res.status(403);
        throw new Error("Messages can only be edited within 5 minutes of sending.");
    }

    // updating the message
    message.encryptedText = newEncryptedMessage;
    message.IsEdited = true;
    message.readAt = null;

    // save the changes which you made above
    await message.save();

    res.status(200).json({
        success: true,
        message: "Message marked as delivered.",
        deliveredAt: message.updatedAt, // using updatedAt as delivery timestamp
        result: message
    });
});

//@desc delete a message
//@route " POST /api/v1/message/:id/delete/:msgId"
//@access private
const deleteMessage = asyncHandler(async(req, res, next) => {
    const msgId = req.params.msgId;
    const senderId = req.cookies.userA_ID;

    const message = await Message.findById(msgId);
    
    // check if there is a message with the provided ID
    if (!message) {
        res.status(404);
        throw new Error("Message not found with the provided ID.");
    }

    // check if the message was send by the user(only the sender can delete his/her message)
    if(message.senderId.toString() !== senderId) {
        res.status(403);
        throw new Error("Forbidden: You cannot delete a message you did not create.");
    }

    // soft delete
    message.isDeleted = true;
    message.encryptedText = "This message was deleted";
    // saving the changes
    await message.save();

    res.status(200).json({
        success: true,
        message: "Message deleted successfully.",
        result: {
            _id: message._id,
            createdAt: message.createdAt,
            LastUpdatedAt: message.updatedAt,
        }
    });
});

export {
    createMessage,
    fetchUnreadMessage,
    getMessage,
    markAsReadMessage,
    updateMessage,
    deleteMessage
};
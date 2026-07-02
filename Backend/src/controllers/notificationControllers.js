import asyncHandler from "../utilities/asyncHandler.js";
import Notification from "../models/notificationModel.js";

//@desc created a new notification document
//@route " POST /api/v1/notification/send"
//@access private
const sendNotification = asyncHandler(async (req, res, next) => {
    // this controller is only responsible for just creating a notification
    const userA_ID = req.cookies.userA_ID;
    const { userB_ID, type, requestID } = req.body;

    if (!userA_ID || !userB_ID || !type) {
        res.status(400);
        throw new Error("Bad Request: Both user IDs and type are required.");
    }

    const validTypes = [
        "request",
        "message",
        "reminder",
        "status",
        "receipt",
        "system",
        "call",
        "security",
        "general"
    ];
    if (!validTypes.includes(type)) {
        res.status(400);
        throw new Error(`Invalid notification type: ${type}`);
    }

    const notification = await Notification.create({
        sender: userA_ID,
        receiver: userB_ID,
        requestID: requestID,
        type: type,
    });

    res.status(201);
    res.json({
        success: true,
        message: "Notification sent successfully",
        result: notification,
    });
});

//@desc get all notifications where receiverID is of the USER
//@route " POST /api/v1/notification/receive"
//@access private
const receiveNotification = asyncHandler(async(req, res, next) => {
    const userA_ID = req.cookies.userA_ID;

    if(!userA_ID) {
        res.status(400);
        throw new Error("User ID is required!");
    }

    const notifications = await Notification.find({ receiver: userA_ID })
    .populate("sender", "username avatar")       // sender details
    .populate("receiver", "username avatar")     // receiver details
    .populate({
      path: "requestID",                         // reference to Request model
      select: "status"                           // only bring back the status field
    })
    .sort({ createdAt: -1 });                    // newest first

    res.status(200);
    res.json({
        success: true,
        message: "Notifications are fetched successfully.",
        result: notifications,
    });
});

//@desc marks unread notification as marked 
//@route " POST /api/v1/notification/read"
//@access private
const readNotification = asyncHandler(async(req, res, next) => {
    const userA_ID = req.cookies.userA_ID;

    if(!userA_ID) {
        res.status(400);
        throw new Error("User ID is missing.");
    }

    const result = await Notification.updateMany(
        {receiver: userA_ID, status: "unread"},
        {$set: { status: "read" }}
    );

    res.status(200);
    res.json({
        success: true,
        message: "Unread messages are marked as read."
    });
});

export {
    sendNotification,
    receiveNotification,
    readNotification
};
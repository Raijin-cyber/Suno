import asyncHandler from "../utilities/asyncHandler.js";
import Request from "../models/requestModel.js";

//@desc creates a new request
//@route " POST /api/v1/request/send"
//@access private
const sendRequest = asyncHandler(async(req, res, next) => {
    const { senderID, receiverID } = req.body;

    console.log (senderID, receiverID);

    if(!senderID || !receiverID) {
        res.status(404);
        throw new Error("Both reciepents IDs are required!");
    }

    // do a check if there is already a request is created
    const existingRequest = await Request.findOne(
        {
            $or: [
                { sender: senderID, receiver: receiverID },
                { sender: receiverID, receiver: senderID }
            ]
        }
    )

    if(existingRequest) {
        res.status(409);
        throw new Error("Request already exist!");
    }

    const request = await Request.create({ sender: senderID, receiver: receiverID });

    res.status(200);
    res.json({
        success: true,
        message: "request created",
        result: request,
    })
})

//@desc accepts a request message
//@route " PUT /api/v1/request/accept"
//@access private
const acceptRequest = asyncHandler(async(req, res, next) => {
    const { requestID } = req.body;
    const userID  = req.cookies.userID;

    if(!requestID || !userID) {
        res.status(400);
        throw new Error("Bad Request: Request and user IDs are required!");
    }

    const request = await Request.findById(requestID);

    if(!request) {
        res.status(404);
        throw new Error("Request not found!");
    }   

    // authorization check
    if (request.receiver.toString() !== userID) {
        res.status(403);
        throw new Error("Not authorized to accept this request.");
    }


    request.status = "accepted";
    await request.save();

    res.status(200);
    res.json({
        success: true,
        message: "Request accepted",
    })
})

//@desc deletes a request message
//@route " Delete /api/v1/request/delete"
//@access private
const deleteRequest = asyncHandler(async(req, res, next) => {
    const { requestID } = req.body;
    const userID  = req.cookies.userID;

    if(!requestID || !userID) {
        res.status(400);
        throw new Error("Bad Request: Request and user IDs are required!");
    }

    const request = await Request.findById(requestID);

    if(!request) {
        res.status(404);
        throw new Error("Request not found!");
    }   

    // authorization check
    if (request.receiver.toString() !== userID && request.sender.toString() !== userID) {
        res.status(403);
        throw new Error("Not authorized to delete this request.");
    }


    await request.deleteOne();

    res.status(200);
    res.json({
        success: true,
        message: "Request deleted",
    })
})

export {
    sendRequest,
    acceptRequest,
    deleteRequest
}
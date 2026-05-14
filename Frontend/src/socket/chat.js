// *** METHODS  

// join conversation(room) 
// leave conversation(room)
// send message
// receive message

// ***NOTE: we are going to pass hook (socket) ref to all of these functions

// in this we are going to join a room, now a room can be of two people or more than 2 people
const roomJoinEvent = (socket, convoId) => {
    socket.emit("join_room", convoId);
}

const roomLeaveEvent = (socket, convoId) => {
    socket.emit("leave_room", convoId);
}

const sendMessage = (socket, message, convoId) => {
    socket.emit("send_message", message, convoId);
}

const receiveMessage = (socket, setChats) => {
    socket.on("receive_message", (payload) => {
        setChats((prev) => [
            ...prev,
            {
                message: payload.text,
                isOwn: payload.senderId === socket.id, // check if I sent it
                time: payload.time
            }
        ]);
    });
}

export {
    roomJoinEvent,
    roomLeaveEvent,
    sendMessage,
    receiveMessage
}
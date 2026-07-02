import { SOCKET_EVENTS } from "./Config/socketEvents.js";

// ****SOCKET-CONVERSATION METHODS****

const ListenerForJoinRoomEvent = (socket) => {
    socket.on(SOCKET_EVENTS.CONVERSATION_JOIN, ({ conversationId }) => {
        socket.join(conversationId);
        console.log(`Socket: ${socket.id} joined room: ${conversationId} successfully!`);
    });
};

const ListenerForJoinManyRoomsEvent = (socket) => {
    socket.on(SOCKET_EVENTS.CONVERSATION_JOIN_MANY, ({ roomIds }) => {
        if(Array.isArray(roomIds)){ 
                roomIds.forEach((room) => {
                socket.join(room);
                console.log(`Socket: ${socket.id} joined room: ${room} successfully!`);
            });
        }
    });
};

const ListenerForLeavingRoom = (socket) => {
    socket.on("conversation:leave", ({ conversationId }) => {
        socket.leave(conversationId);
        console.log(`Socket: ${socket.id} left room: ${conversationId} successfully!`);
    });
};

export {
    ListenerForJoinRoomEvent,
    ListenerForJoinManyRoomsEvent,
    ListenerForLeavingRoom
};


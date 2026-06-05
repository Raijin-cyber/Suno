import { SOCKET_EVENTS } from "./Config/socketEvents.js";

// *** SOCKET-CONVERSATION METHODS ***  

const listenForMarkAsReadEvent = (io, socket) => {
    socket.on(SOCKET_EVENTS.MESSAGE_MARK_READ, ({ conversationId, messageId, readerId }) => {
        socket.broadcast.to(conversationId).emit(SOCKET_EVENTS.MESSAGE_MARK_READ, { conversationId, messageId, readerId });
    })
}

export {
    listenForMarkAsReadEvent,
}
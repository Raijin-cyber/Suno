import { SOCKET_EVENTS } from "./Config/socketEvents.js";

// *** SOCKET-CONVERSATION METHODS ***  

const listenForMarkAsReadEvent = (io, socket) => {
    socket.on(SOCKET_EVENTS.MESSAGE_MARK_READ, ({ conversationId, messageId, readerUsername, readerId, readTime }) => {
        io.to(conversationId).emit(SOCKET_EVENTS.MESSAGE_MARK_READ, { conversationId, messageId, readerUsername, readerId, readTime });
    })
}

export {
    listenForMarkAsReadEvent,
}
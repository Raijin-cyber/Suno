import { SOCKET_EVENTS } from "./Config/socketEvents.js";

// *** SOCKET-TYPING METHODS ***

const listenForTypingEvent = (io, socket) => {
    socket.on(SOCKET_EVENTS.TYPING_START, ({ conversationId, userId }) => {
        socket.broadcast.to(conversationId).emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId });
    });
};

const listenForNotTypingEvent = (io, socket) => {
    socket.on(SOCKET_EVENTS.TYPING_STOP, ({ conversationId, userId }) => {
        socket.broadcast.to(conversationId).emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
    });
};

export {
    listenForTypingEvent,
    listenForNotTypingEvent
};
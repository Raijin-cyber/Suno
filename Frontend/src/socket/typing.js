import { updateTyping, stopTyping } from "../store/conversationsSlice"; // importing actions
import { SOCKET_EVENTS } from "./socketEvents";

// *** SOCKET-TYPING METHODS ***

const listenForTypingEvent = (socket, dispatch) => {
    socket.on(SOCKET_EVENTS.TYPING_START, ({ conversationId, userId }) => {
        if (conversationId && userId) dispatch(updateTyping({ conversationId, userId }));
    })

    return () => socket.off(SOCKET_EVENTS.TYPING_START);
}

const listenForNotTypingEvent = (socket, dispatch) => {
    socket.on(SOCKET_EVENTS.TYPING_STOP, ({ conversationId, userId }) => {
        if (conversationId && userId) dispatch(stopTyping({ conversationId, userId }));
    })

    return () => socket.off(SOCKET_EVENTS.TYPING_STOP);
}

const emitTypingEvent = (socket, { conversationId, userId }) => {
    socket.emit(SOCKET_EVENTS.TYPING_START, { conversationId, userId });
}

const emitNotTypingEvent = (socket, { conversationId, userId }) => {
    socket.emit(SOCKET_EVENTS.TYPING_STOP, { conversationId, userId });
}

export {
    listenForTypingEvent,
    emitTypingEvent,
    listenForNotTypingEvent,
    emitNotTypingEvent
}
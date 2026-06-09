import { SOCKET_EVENTS } from "./Config/socketEvents.js";
import formatTime from "../utilities/formatTime.js";

// ****SOCKET-CHAT METHODS****

const emitMessageEvent = (io, socket) => {
    socket.on(SOCKET_EVENTS.MESSAGE_SEND, ({ senderId, conversationId, messageId, message, messageCreator, referenceMessage, referenceMessageCreator }) => {
        const payload = {
            messageId: messageId,
            message: message,
            messageCreator: messageCreator,
            referenceMessage: referenceMessage,
            referenceMessageCreator: referenceMessageCreator,
            senderId: socket.id, 
            conversationId: conversationId,
            time: formatTime(new Date().toISOString()),
        };

        io.to(conversationId).emit(SOCKET_EVENTS.MESSAGE_RECEIVE, payload);
    });
}

export {
    emitMessageEvent,
}
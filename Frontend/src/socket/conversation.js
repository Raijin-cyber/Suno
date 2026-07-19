import { updateReadReceipt } from "../store/messagesSlice";
import { markAsReadMessage } from "../services/messageServices";
import { SOCKET_EVENTS } from "./socketEvents";

// *** SOCKET-CONVERSATION METHODS ***  

const listenForMarkAsReadEvent = (socket, dispatch) => {
    socket.on(SOCKET_EVENTS.MESSAGE_MARK_READ, ({ conversationId, messageId, readerUsername, readerId, readTime }) => {
        dispatch(updateReadReceipt({ convoId: conversationId, messageId, readerUsername, readerId, readTime }));
    })

    return () => {
        socket.off(SOCKET_EVENTS.MESSAGE_MARK_READ);
    }
}

const emitMarkAsReadEvent = (socket, { conversationId, messageId, readerUsername, readerId, readTime }) => {
    markAsReadMessage(messageId, readerId, readerUsername, readTime)
    .then((res) => {
        socket.emit(SOCKET_EVENTS.MESSAGE_MARK_READ, { conversationId, messageId, readerUsername, readerId, readTime })
    });
}

export {
    listenForMarkAsReadEvent,
    emitMarkAsReadEvent,
}
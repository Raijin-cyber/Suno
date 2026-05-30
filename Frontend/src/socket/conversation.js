import { resetUnread, updateReadReceipt } from "../store/conversationsSlice"
import { SOCKET_EVENTS } from "./socketEvents";

// *** SOCKET-CONVERSATION METHODS ***  

const listenForMarkAsReadEvent = (socket, dispatch) => {
    socket.on(SOCKET_EVENTS.MESSAGE_MARK_READ, ({ conversationId, messageId, readerId }) => {
        dispatch(updateReadReceipt({ conversationId, messageId, readerId }));
        dispatch(resetUnread({ conversationId }));
    })

    return () => {
        socket.off(SOCKET_EVENTS.MESSAGE_MARK_READ);
    }
}

export {
    listenForMarkAsReadEvent,
}
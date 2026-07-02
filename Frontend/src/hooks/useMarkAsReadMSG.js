import store from "../store/store";
import { useSocket } from "./useSocket";
import { useCallback, useEffect, useState } from "react";
import { emitMarkAsReadEvent } from "../socket/conversation";
import { clearUnreadMessages, resetUnread } from "../store/conversationsSlice";

const useMarkAsReadMSG = ({ conversationId, conversations }) => {
    
    const socket = useSocket();
    const [error, setError] = useState(null);
    const userData = store.getState().auth.userData;
    const unreadMessages = store.getState().conversations.byId[conversationId]?.unreadMessages || [];    
    
    const markMessagesAsRead = useCallback(() => {
        if(!conversationId) {
            setError(
                {
                    error: "failed to mark as read!",
                    message: "conversationId is missing."
                }
            )
            return;
        }

        if(unreadMessages.length > 0) {
            unreadMessages.forEach((u) => {
                emitMarkAsReadEvent(socket,
                    {
                        conversationId: conversationId,
                        messageId: u.messageId,
                        readerUsername: userData?.username, 
                        readerId: userData?._id, 
                        readTime: Date.now()              
                    }
                )
            })
            store.dispatch(clearUnreadMessages({ conversationId: conversationId }));
        }
        store.dispatch(resetUnread({ conversationId: conversationId }));
    }, [unreadMessages, conversationId])

    useEffect(() => {
        markMessagesAsRead();
    }, [conversations])

    return { error };
}

export default useMarkAsReadMSG;

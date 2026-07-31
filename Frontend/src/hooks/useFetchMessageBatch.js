import store from "../store/store";
import { useCallback, useEffect, useState } from "react";
import { updateOldMessage } from "../store/messagesSlice";
import { fetchMessage } from "../services/messageServices";
import { updateCursorId } from "../store/conversationsSlice";

const useFetchMessageBatch = ({ conversationId, userData, trigger }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const updateMessageStore = useCallback(() => {
        const cursorId = store.getState().conversations?.byId[conversationId]?.cursorId || null;
        
        if(!conversationId) {
            setError({error: "Bad Request", message: "Conversation ID is missing."});
            return;
        }

        if(loading) return;

        if(trigger && hasMore) {
            setLoading(true);
            fetchMessage(conversationId, 20, cursorId)
            .then(({ messages }) => {
                if(!messages?.length) {
                    setHasMore(false);
                    return;
                }

                store.dispatch(updateOldMessage(
                    { 
                        oldMessages: messages, 
                        userId: userData?._id, 
                        convoId: conversationId 
                    }
                ));
                store.dispatch(updateCursorId({ conversationId, cursorId: messages[0]._id }));
            })
            .catch((error) => setError(error))
            .finally(() => setLoading(false))
        }
    }, [conversationId, trigger]);
    
    useEffect(() => {
        if(trigger || conversationId) updateMessageStore()
    }, [trigger])

    useEffect(() => {
        setHasMore(true);
    }, [conversationId])

    return { error, loading, hasMore };
}

export default useFetchMessageBatch;
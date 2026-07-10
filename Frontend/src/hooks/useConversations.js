import { getAllUserConversation } from "../services/conversationServices";
import { updateLastMessage } from "../store/conversationsSlice";
import { useCallback, useEffect, useState } from "react";
import formatTime from "../utils/formatTime";
import { useDispatch } from "react-redux";

const useConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    
    const refresh = useCallback(() => {
        setLoading(true);
        getAllUserConversation()
        .then(c => {
            setConversations(c);
            const lastMessages = c?.map(cnvs => (
                {
                    conversationId: cnvs?.convoId,
                    message: cnvs?.lastMessage.encryptedText,
                    time: formatTime(cnvs?.lastMessage.createdAt)
                }
            ));
            // dispatch once instead of at every iteration preventing from unnecessary re-renders
            dispatch(updateLastMessage({ lastMessages: lastMessages }))
        })
        .catch(err => setError(err))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        refresh();
    }, [])

    return { conversations, loading, error, refresh };

}

export default useConversations;
import { getAllUserConversation } from "../services/conversationServices";
import { updateLastMessage } from "../store/conversationsSlice";
import { useCallback, useEffect, useState } from "react";
import formatTime from "../utils/formatTime";
import store from "../store/store";

const useConversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const refresh = useCallback(() => {
        setLoading(true);
        getAllUserConversation()
        .then(c => {
            setConversations(c);
            c?.forEach((cnvs) => {
                store.dispatch(updateLastMessage(
                    { 
                        conversationId: cnvs?.convoId, 
                        message: cnvs?.lastMessage.encryptedText, 
                        time: formatTime(cnvs?.lastMessage.createdAt) 
                    }
                )
            )})
        })
        .catch(err => setError(err))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh])

    return { conversations, loading, error, refresh };

}

export default useConversations;


// @Purpose: Fetches all conversations of a user.
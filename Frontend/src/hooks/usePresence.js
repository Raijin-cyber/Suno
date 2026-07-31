import { useCallback, useEffect } from "react";
import { useSocket } from "./useSocket";
import { emitOnlineEvent, emitOfflineEvent } from "../socket/presence";

const usePresence = ({ userId, conversationIds }) => {
    const socket = useSocket();

    const emitOnline = useCallback(() => {
        if(!userId || !conversationIds) return;
        emitOnlineEvent(socket, { userId, conversationIds });
    }, [userId, conversationIds]);

    const emitOffline = useCallback(() => {
        if(!userId || !conversationIds) return;
        emitOfflineEvent(socket, { userId, conversationIds })
    }, [userId, conversationIds]);

    useEffect(() => {
        emitOnline();   // When component mounts emit first online event
        return () => emitOffline();     // When component unmounts emit offline event
    }, [userId, conversationIds])
}

export default usePresence;
import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { emitPresencePingEvent } from "../socket/presence";

const usePingServer = ({ userId, conversationIds }) => {
    const socket  = useSocket();

    // following heartbeat method
    const ping = () => {
        const interval = setInterval(() => {
            if(!userId || !conversationIds) return;

            emitPresencePingEvent(socket, {
                userId,
                conversationIds
            })
        }, 30000);

        return interval;
    }

    useEffect(() => {
        const pingInterval = ping();

        return () => {
            clearInterval(pingInterval);
        }
    }, [userId, conversationIds]);

    return ping;
}

export default usePingServer;
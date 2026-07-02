import { useSocket } from "./useSocket";
import { useEffect } from "react";
import { emitPresencePingEvent } from "../socket/presence";

const usePingServer = (id) => {
    const socket  = useSocket();

    const ping = () => {
        const interval = setInterval(() => {
            emitPresencePingEvent(socket, {
                userId: id
                // pass the room Ids and store in the redis. 
            })
        }, 30000);

        return interval;
    }

    useEffect(() => {
        const pingInterval = ping();

        return () => {
            clearInterval(pingInterval);
        }
    }, []);
}

export default usePingServer;
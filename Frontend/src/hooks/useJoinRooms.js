import { useSocket } from "./useSocket";
import { joinRooms } from "../socket/chat";
import { useCallback, useEffect } from "react";

const useJoinRooms = (conversations) => {
    const socket = useSocket();
    const joinRoomsEventEmitter = useCallback(() => {
        if (conversations) {
            joinRooms(socket, { roomIds: conversations?.map(c => c?.convoId) });
        }
    }, [conversations]);
    // TODO: Go to the backend and store conversations IDs and store them inside the redis for receiving ping events from the client and emitting to the respective rooms.
    
    useEffect(() => {
        joinRoomsEventEmitter();
    }, [conversations]);
}

export default useJoinRooms;
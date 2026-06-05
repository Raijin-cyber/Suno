import validateToken from "./middlewares/validateToken.js";
import { emitMessageEvent } from "./chat.js";
import { ListenerForJoinManyRoomsEvent, ListenerForJoinRoomEvent, ListenerForLeavingRoom } from "./room.js";
import { listenForTypingEvent, listenForNotTypingEvent } from "./typing.js";
import { listenForOfflineUsersEvent, listenForOnlineUsersEvent, listenForPresencePingEvent } from "./presence.js";
import { listenForMarkAsReadEvent } from "./conversation.js";

const configSocket = (io) => {
    io.on("connection", (socket) => {
        // console if a socket is connected
        console.log("New Socket:", socket.id);

        // connection related events
        (() => {
            socket.on("disconnect", (reason) => {
                console.log(`Client ${socket.id} disconnected: ${reason}`);
            })
            
            socket.on("reconnect_attempt", (attempt) => {
                console.log("Reconnection attempt:", attempt);
            });
        })()
        
        // custom middlewares
        validateToken(socket);

        // room joining related events
        ListenerForJoinManyRoomsEvent(socket);
        ListenerForJoinRoomEvent(socket);
        ListenerForLeavingRoom(socket);

        // typing related events
        listenForTypingEvent(io, socket);
        listenForNotTypingEvent(io, socket);

        // presence related events
        listenForOnlineUsersEvent(io, socket);
        listenForOfflineUsersEvent(io, socket);
        listenForPresencePingEvent(io, socket);

        // message related events
        emitMessageEvent(io, socket);

        // read receipt related events
        listenForMarkAsReadEvent(io, socket);
    })
}

export default configSocket;


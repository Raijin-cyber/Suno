import formatTime from "../utilities/formatTime.js";
import validateToken from "./middlewares/validateToken.js";

const configSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New Socket:", socket.id);
        
        // custom middlewares
        validateToken(socket);

        socket.on("conversation:join", ({ conversationId }) => {
            socket.join(conversationId);
            console.log(`Socket: ${socket.id} joined room: ${conversationId} successfully!`);
        });

        socket.on("conversation:joinMany", ({ roomIds }) => {
            if(Array.isArray(roomIds)){ 
                    roomIds.forEach((room) => {
                    socket.join(room);
                    console.log(`Socket: ${socket.id} joined room: ${room} successfully!`);
                })
            }
        })

        socket.on("conversation:leave", ({ conversationId }) => {
            socket.leave(conversationId);
            console.log(`Socket: ${socket.id} left room: ${conversationId} successfully!`);
        })

        socket.on("message:send", ({ senderId, conversationId, message }) => {
            const payload = {
                message: message,
                senderId: socket.id, 
                conversationId: conversationId,
                time: formatTime(new Date().toISOString()),
            };

            io.to(conversationId).emit("message:receive", payload);
        });


        socket.on("disconnect", (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`);
        })
        
        socket.on("reconnect_attempt", (attempt) => {
            console.log("Reconnection attempt:", attempt);
        });
    })
}

export default configSocket;


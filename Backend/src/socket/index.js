import formatTime from "../utilities/formatTime.js";

const configSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New Socket:", socket.id);
        
        socket.on("join_room", (room) => {
            socket.join(room);
            console.log(`Socket: ${socket.id} joined room: ${room} successfully!`);
        });

        socket.on("leave_room", (room) => {
            socket.leave(room);
            console.log(`Socket: ${socket.id} left room: ${room} successfully!`);
        })

        socket.on("send_message", (message, convoId) => {
            const payload = {
                text: message,
                senderId: socket.id, 
                time: formatTime(new Date().toISOString())
            };

            io.to(convoId).emit("receive_message", payload);
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


import { SOCKET_EVENTS } from "./socketEvents";

const listenForErrorforWs = (socket, setError) => {
    socket.on(SOCKET_EVENTS.ERROR, ({ code, message, timestamp, type }) => {
        setError({ code, message, timestamp, type });
    });

    return () => {
        socket.off(SOCKET_EVENTS.ERROR);
    }
}

export default listenForErrorforWs;
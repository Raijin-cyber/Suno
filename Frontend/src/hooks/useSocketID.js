import { socket } from "../socket/socket.js";

export const useSocketID = (socket) => {
    return socket.id;
}
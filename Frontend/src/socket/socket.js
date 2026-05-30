import { io } from "socket.io-client";

// this export mechanism ensures that there is only one instance of socket all over the app.
export const socket = io(import.meta.env.VITE_API_ROOT_URL, { autoConnect: false, reconnection: true, withCredentials: true, reconnectionAttempts: 5}); 
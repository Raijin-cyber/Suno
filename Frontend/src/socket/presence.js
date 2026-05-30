import { updatePresence } from "../store/conversationsSlice";
import { SOCKET_EVENTS } from "./socketEvents";

// *** SOCKET-PRESENCE METHODS ***  

const listenForOnlineUsersEvent = (socket, dispatch) => {
  socket.on(SOCKET_EVENTS.PRESENCE_ONLINE, ({ userId, status }) => {
    if (userId && status) {
      dispatch(updatePresence({ userId, status }));
    } else {
      console.error("Presence error: userId or status missing.");
    }
  });

  return () => socket.off(SOCKET_EVENTS.PRESENCE_ONLINE);
};

const listenForOfflineUsersEvent = (socket, dispatch) => {
  socket.on(SOCKET_EVENTS.PRESENCE_OFFLINE, ({ userId, status }) => {
    if (userId && status) {
      dispatch(updatePresence({ userId, status }));
    } else {
      console.error("Presence error: userId or status missing.");
    }
  });

  return () => socket.off(SOCKET_EVENTS.PRESENCE_OFFLINE);
};

const emitOnlineEvent = (socket, { userId, status }) => {
  if (userId && status) {
    socket.emit(SOCKET_EVENTS.PRESENCE_ONLINE, { userId, status });
  } else {
    console.error("Presence error: userId or status missing.");
  }
};

const emitOfflineEvent = (socket, { userId, status }) => {
  if (userId && status) {
    socket.emit(SOCKET_EVENTS.PRESENCE_OFFLINE, { userId, status });
  } else {
    console.error("Presence error: userId or status missing.");
  }
};

export {
  listenForOnlineUsersEvent,
  listenForOfflineUsersEvent,
  emitOfflineEvent,
  emitOnlineEvent
};

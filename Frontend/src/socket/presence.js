import { updatePresence } from "../store/conversationsSlice";
import { SOCKET_EVENTS } from "./socketEvents";

// *** SOCKET-PRESENCE METHODS ***  

const listenForOnlineUsersEvent = (socket, dispatch) => {
  socket.on(SOCKET_EVENTS.PRESENCE_ONLINE, ({ conversationId, members }) => {
    if (conversationId && members) {
      dispatch(updatePresence({ conversationId, members }));
    } else {
      console.error("Presence error: conversationId or members array are missing.");
    }
  });

  return () => socket.off(SOCKET_EVENTS.PRESENCE_ONLINE);
};

const listenForOfflineUsersEvent = (socket, dispatch) => {
  socket.on(SOCKET_EVENTS.PRESENCE_OFFLINE, ({ conversationId, members }) => {
    if (conversationId && members) {
      dispatch(updatePresence({ conversationId, members }));
    } else {
      console.error("Presence error: conversationId or members array are missing.");
    }
  });

  return () => socket.off(SOCKET_EVENTS.PRESENCE_OFFLINE);
};

const emitOnlineEvent = (socket, { userId, conversationIds }) => {
  if (userId && conversationIds) {
    socket.emit(SOCKET_EVENTS.PRESENCE_ONLINE, { userId, conversationIds });
  } else {
    console.error("Presence error: userId or conversationIds missing.");
  }
};

const emitOfflineEvent = (socket, { userId, conversationIds }) => {
  if (userId && conversationIds) {
    socket.emit(SOCKET_EVENTS.PRESENCE_OFFLINE, { userId, conversationIds });
  } else {
    console.error("Presence error: userId or conversationIds missing.");
  }
};

const emitPresencePingEvent = (socket, { userId, conversationIds }) => {
  if (userId && conversationIds) {
    socket.emit(SOCKET_EVENTS.PRESENCE_PING, { userId, conversationIds });
  } else {
    console.error("Presence error: userId or conversationIds missing.");
  }
};

export {
  listenForOnlineUsersEvent,
  listenForOfflineUsersEvent,
  emitOfflineEvent,
  emitOnlineEvent,
  emitPresencePingEvent
};

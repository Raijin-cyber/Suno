import { updateLastMessage, incrementUnread } from "../store/conversationsSlice";
import { SOCKET_EVENTS } from "./socketEvents";

// *** SOCKET METHODS ***

// Join a single conversation room
const joinRoom = (socket, { conversationId }) => {
  socket.emit(SOCKET_EVENTS.CONVERSATION_JOIN, { conversationId });
};

// Join multiple conversation rooms at once
const joinRooms = (socket, { roomIds }) => {
  socket.emit(SOCKET_EVENTS.CONVERSATION_JOIN_MANY, { roomIds });
};

// Leave a conversation room
const leaveRoom = (socket, { conversationId }) => {
  socket.emit(SOCKET_EVENTS.CONVERSATION_LEAVE, { conversationId });
};

// Send a message to a conversation room
const sendMessage = (socket, { conversationId, message }) => {
  const senderId = socket.id;
  socket.emit(SOCKET_EVENTS.MESSAGE_SEND, { senderId, conversationId, message });
};

// Listen for incoming messages
const listenForMessages = (socket, dispatch, setChats) => {
  socket.on(SOCKET_EVENTS.MESSAGE_RECEIVE, ({ senderId, conversationId, message, time }) => {
    setChats((prev) => [
      ...prev,
      {
        message: message,
        isOwn: senderId === socket.id, // check if I sent it
        conversationId,
        time: time,
      },
    ]); 

    dispatch(updateLastMessage({ conversationId, message }));
    dispatch(incrementUnread({ conversationId }));
  });

  return () => socket.off(SOCKET_EVENTS.MESSAGE_RECEIVE);
};

export {
  joinRoom,
  joinRooms,
  leaveRoom,
  sendMessage,
  listenForMessages,
};

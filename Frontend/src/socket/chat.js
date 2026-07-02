import { updateLastMessage, incrementUnread, updateUnreadMessages } from "../store/conversationsSlice";
import { storeMessage } from "../services/messageServices";
import { updateNewMessage } from "../store/messagesSlice";
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
const sendMessage = (socket, { conversationId, referenceMessageId, message, messageCreator, referenceMessage, referenceMessageCreator }) => {
  // store message to DB for persistency
  storeMessage({id: conversationId, encryptedMessage: message, referenceMessageId: referenceMessageId})
    .then((res) => {
      console.log(res);
      console.log(referenceMessageId);
      const senderId = socket.id;
      const messageId = res?.result?._id;
      socket.emit(SOCKET_EVENTS.MESSAGE_SEND, { senderId, conversationId, messageId, message, messageCreator, referenceMessage, referenceMessageCreator });
    })
};

// Listen for incoming messages
const listenForMessages = (socket, dispatch) => {
  socket.on(SOCKET_EVENTS.MESSAGE_RECEIVE, ({ senderId, conversationId, messageId, message, messageCreator, referenceMessage, referenceMessageCreator, time }) => { 
    // update messages slice -> store messages in the store
    dispatch(updateNewMessage({
      convoId: conversationId, 
      messageId: messageId,
      message: message, 
      messageCreator: messageCreator, 
      referenceMessage: referenceMessage, 
      referenceMessageCreator: referenceMessageCreator,
      isOwn: senderId === socket.id, 
      time: time,
    }));

    // only other user's message
    if(senderId !== socket.id) {
      dispatch(updateUnreadMessages({
        conversationId: conversationId, 
        messageId: messageId,
        message: message, 
        messageCreator: messageCreator, 
        referenceMessage: referenceMessage, 
        referenceMessageCreator: referenceMessageCreator,
        isOwn: senderId === socket.id, 
        time: time,
      }));
    }
    
    dispatch(updateLastMessage({ conversationId, message, time }));
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

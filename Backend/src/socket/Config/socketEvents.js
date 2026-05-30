export const SOCKET_EVENTS = {
  // Conversation
  CONVERSATION_JOIN: "conversation:join",
  CONVERSATION_JOIN_MANY: "conversation:joinMany",
  CONVERSATION_LEAVE: "conversation:leave",

  // Message
  MESSAGE_SEND: "message:send",
  MESSAGE_RECEIVE: "message:receive",
  MESSAGE_MARK_READ: "message:markRead",

  // Unread
  UNREAD_INCREMENT: "unread:increment",
  UNREAD_RESET: "unread:reset",

  // Presence
  PRESENCE_ONLINE: "presence:online",
  PRESENCE_OFFLINE: "presence:offline",

  // Typing
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",

  // Error
  ERROR: "error:event",
};

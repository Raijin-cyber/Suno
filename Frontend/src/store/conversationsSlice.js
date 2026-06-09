import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byId: {},
  presence: {}
};

const ensureConvo = (state, conversationId) => {
  if (!state.byId[conversationId]) {
    state.byId[conversationId] = {
      lastMessage: null,
      lastMessageTime: null,
      typingUsers: [],
      unreadCount: 0,
      unreadMessages: []
    };
  }
  return state.byId[conversationId];
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    updatePresence: (state, action) => {
      const { conversationId, members } = action.payload;
      state.presence[conversationId] = members;
    },
    updateTyping: (state, action) => {
      const { conversationId, userId } = action.payload;
      const convo = ensureConvo(state, conversationId);
      convo.typingUsers = [...new Set([...convo.typingUsers, userId])];
    },
    stopTyping: (state, action) => {
      const { conversationId, userId } = action.payload;
      const convo = state.byId[conversationId];
      if (convo?.typingUsers) {
        convo.typingUsers = convo.typingUsers.filter(id => id !== userId);
      }
    },
    updateLastMessage: (state, action) => {
      const { conversationId, message, time } = action.payload;
      const convo = ensureConvo(state, conversationId);
      convo.lastMessage = message;
      convo.lastMessageTime = time;
    },
    incrementUnread: (state, action) => {
      const { conversationId } = action.payload;
      const convo = ensureConvo(state, conversationId);
      convo.unreadCount += 1;
    },
    resetUnread: (state, action) => {
      const { conversationId } = action.payload;
      const convo = ensureConvo(state, conversationId);
      convo.unreadCount = null;
    },
    updateUnreadMessages: (state, action) => {
      const { conversationId, messageId, message, messageCreator, referenceMessage, referenceMessageCreator, time  } = action.payload;

      // now store unread message
      state.byId[conversationId].unreadMessages.push({ conversationId, messageId, message, messageCreator, referenceMessage, referenceMessageCreator, time });
    },
    clearUnreadMessages: (state, action) => {
      const { conversationId } = action.payload;
      state.byId[conversationId].unreadMessages = [];
    }
  }
});

export default conversationsSlice.reducer;
export const {
  updatePresence,
  updateTyping,
  stopTyping,
  updateLastMessage,
  incrementUnread,
  resetUnread,
  updateUnreadMessages,
  clearUnreadMessages
} = conversationsSlice.actions;

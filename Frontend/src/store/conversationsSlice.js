import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  byId: {},
  presence: {}
};

const ensureConvo = (state, conversationId) => {
  if (!state.byId[conversationId]) {
    state.byId[conversationId] = {
      lastMessage: null,
      typingUsers: [],
      unreadCount: 0,
      readReceipts: {}
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
      const { conversationId, message } = action.payload;
      const convo = ensureConvo(state, conversationId);
      convo.lastMessage = message;
    },
    incrementUnread: (state, action) => {
      const { conversationId } = action.payload;
      const convo = ensureConvo(state, conversationId);
      convo.unreadCount += 1;
    },
    resetUnread: (state, action) => {
      const { conversationId } = action.payload;
      const convo = ensureConvo(state, conversationId);
      convo.unreadCount = 0;
    },
    updateReadReceipt: (state, action) => {
      const { conversationId, messageId, readerId } = action.payload;
      const convo = ensureConvo(state, conversationId);
      convo.readReceipts[messageId] = [
        ...new Set([...(convo.readReceipts[messageId] || []), readerId])
      ];
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
  updateReadReceipt
} = conversationsSlice.actions;

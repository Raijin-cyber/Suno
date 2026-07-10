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
      cursorId: null,
      typingUsers: [],
      unreadCount: null,
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
      const { conversationId, message, time, lastMessages } = action.payload;
      
      if(lastMessages && Array.isArray(lastMessages)) {
        lastMessages.forEach(cnvs => {
          const convo = ensureConvo(state, cnvs?.conversationId);
          convo.lastMessage = cnvs.message;
          convo.lastMessageTime = cnvs.time;
        })
        return;
      }
      
      const convo = ensureConvo(state, conversationId);
      convo.lastMessage = message;
      convo.lastMessageTime = time;
    },
    updateCursorId: (state, action) => {
      const { conversationId, cursorId } = action.payload;
      const convo = ensureConvo(state, conversationId);
      convo.cursorId = cursorId;
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

      // check if the array of unread messages exist 
      if(!state.byId[conversationId]) {
        state.byId[conversationId] = { unreadMessages: [] };
      }

      // now store unread message
      state.byId[conversationId].unreadMessages.push({ conversationId, messageId, message, messageCreator, referenceMessage, referenceMessageCreator, time });
    },
    clearUnreadMessages: (state, action) => {
      const { conversationId } = action.payload;
      state.byId[conversationId].unreadMessages = [];
    },
    resetConversations: () => initialState
  }
});

export default conversationsSlice.reducer;
export const {
  updatePresence,
  updateTyping,
  stopTyping,
  updateLastMessage,
  updateCursorId,
  incrementUnread,
  resetUnread,
  updateUnreadMessages,
  clearUnreadMessages,
  resetConversations,
} = conversationsSlice.actions;

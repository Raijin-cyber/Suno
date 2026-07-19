import formatTime from "../utils/formatTime";
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";


/*
Normalized shape per conversation:

byConversationId: {
  [convoId]: {
    byId: {
      [messageId]: {
        messageId,
        message,
        messageCreator,
        referenceMessage,
        referenceMessageCreator,
        isOwn,
        time,
        readByAt: {
          [readerId]: { readerUsername, readTime }
        }
      }
    },
    allIds: [messageId, ...]   // preserves chronological order
  }
}

Why this shape:
- byId gives O(1) existence checks / lookups instead of Array.find / Array.some (O(n)).
- allIds keeps ordering explicit and cheap to prepend/append to.
- readByAt as a dict keyed by readerId gives O(1) duplicate-read-receipt checks.
*/

const getInitialState = () => ({
    byConversationId: {}
});

const initialState = getInitialState();

const ensureConvo = (state, convoId) => {
    if (!state.byConversationId[convoId]) {
        state.byConversationId[convoId] = { byId: {}, allIds: [] };
    }
    return state.byConversationId[convoId];
};

const normalizeReadByAt = (readByAt) => {
    // Accepts either an array [{readerId, readerUsername, readTime}, ...]
    // or an already-normalized object, and returns a dict keyed by readerId.
    if (!readByAt) return {};
    if (Array.isArray(readByAt)) {
        return readByAt.reduce((acc, r) => {
            if (r?.readerId) {
                acc[r.readerId] = { readerUsername: r.readerUsername, readTime: r.readTime };
            }
            return acc;
        }, {});
    }
    return readByAt;
};

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        updateNewMessage: (state, action) => {
            const { convoId, messageId, message, messageCreator, referenceMessage, referenceMessageCreator, isOwn, time, readByAt } = action.payload;

            const convo = ensureConvo(state, convoId);

            // O(1) duplicate check instead of scanning the array
            if (convo.byId[messageId]) {
                return; // already have this message, skip
            }

            convo.byId[messageId] = {
                messageId,
                message,
                messageCreator,
                referenceMessage,
                referenceMessageCreator,
                isOwn,
                time,
                readByAt: normalizeReadByAt(readByAt)
            };
            convo.allIds.push(messageId);
        },

        updateOldMessage: (state, action) => {
            const { oldMessages, userId, convoId } = action.payload;

            const convo = ensureConvo(state, convoId);

            // Build only the ones we don't already have, preserving incoming order
            const newIds = [];
            for (const msg of oldMessages) {
                const messageId = msg?._id;
                if (!messageId || convo.byId[messageId]) continue; // dedup, O(1)
                convo.byId[messageId] = {
                    messageId,
                    message: msg?.encryptedText,
                    messageCreator: msg?.senderId?.username || null,
                    referenceMessage: msg?.referenceMessage?.encryptedText || null,
                    referenceMessageCreator: msg?.senderId?.username || null,
                    isOwn: userId === msg?.senderId?._id,
                    time: formatTime(msg?.createdAt),
                    readByAt: msg?.readByAt
                };
                newIds.push(messageId);
            }

            // Old messages are prepended (they're older than what's already loaded)
            convo.allIds = [...newIds, ...convo.allIds];
        },

        updateReadReceipt: (state, action) => {
            const { convoId, messageId, readerUsername, readerId, readTime } = action.payload;

            // O(1) lookup instead of Array.find
            const targetMessage = state.byConversationId[convoId]?.byId[messageId];
            if (!targetMessage) return;

            if (!targetMessage.readByAt) {
                targetMessage.readByAt = {};
            }

            // O(1) duplicate check instead of Array.some
            if (!targetMessage.readByAt[readerId]) {
                targetMessage.readByAt[readerId] = { readerUsername, readTime };
            }
        },

        // NOTE: this previously overwrote byConversationId[convoId] (an array of
        // messages) with a single plain object, which breaks the shape every
        // other reducer assumes. Keeping the same *intent* here (store a single
        // draft-like value) but in its own namespace so it can't collide with
        // the normalized message list. Double check where this is consumed —
        // it likely wants its own slice (e.g. a "drafts" slice) rather than
        // living inside messagesSlice at all.
        setMessage: (state, action) => {
            const { convoId, message, messageCreator, referenceMessage, referenceMessageCreator } = action.payload;
            if (!state.draftByConversationId) {
                state.draftByConversationId = {};
            }
            state.draftByConversationId[convoId] = { message, messageCreator, referenceMessage, referenceMessageCreator };
        },

        resetMessages: () => getInitialState()
    }
});

export default messagesSlice.reducer;
export const { updateNewMessage, updateOldMessage, updateReadReceipt, setMessage, resetMessages } = messagesSlice.actions;

// --- Selectors ---
// Components typically want an ordered array, not the normalized shape.
// These convert on read, cheaply, without needing reselect for most cases.
// If a conversation gets very large and re-renders become an issue, wrap
// these with `createSelector` from reselect to memoize per convoId.

export const selectMessagesByConvoId = createSelector(
    [(state, convoId) => state.messages.byConversationId[convoId]],
    (convo) => {
        if (!convo) return [];
        return convo.allIds.map(id => convo.byId[id]);
});

export const selectMessageById = (state, convoId, messageId) => {
    return state.messages.byConversationId[convoId]?.byId[messageId] || null;
};
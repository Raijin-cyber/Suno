import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    byConversationId: {
        // convoId: [{message: "", messageCreator: "", referenceMessage: "", referenceMessageCreator: "", isOwn: true, time: "11:11", readByAt: [{userId, readTime}]}]
    }
}

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        updateMessage: (state, action) => {
            const { convoId, messageId, message, messageCreator, referenceMessage, referenceMessageCreator, isOwn, time, readByAt } = action.payload;
            // Ensure array exists
            if(!state.byConversationId[convoId]) {
                state.byConversationId[convoId] = [];
            }

            // Push new message
            state.byConversationId[convoId].push({ messageId, message, messageCreator, referenceMessage, referenceMessageCreator, isOwn, time, readByAt: readByAt || [] });
        },
        updateReadReceipt: (state, action) => {
            const { convoId, messageId, readerUsername, readerId, readTime } = action.payload;

            // Find that message
            const targetMessage = state.byConversationId[convoId]?.find(msg => msg.messageId === messageId);
            
            // ensure target message exists
            if (!targetMessage) return;

            // ensure targetMessage readByAt array exists
            if(!targetMessage) {
                targetMessage.readByAt = [];
            }

            // prevent duplicates
            const alreadyExists = targetMessage.readByAt.some(r => r.readerId === readerId);
            if(!alreadyExists) {
                targetMessage.readByAt.push({messageId, readerId, readerUsername, readTime});
            }
        },
        setMessage: (state, action) => {
            const { convoId, message, messageCreator, referenceMessage, referenceMessageCreator } = action.payload;
            state.byConversationId[convoId] = { message, messageCreator, referenceMessage, referenceMessageCreator };
        }
    }
})

export default messagesSlice.reducer;
export const { updateMessage, updateReadReceipt, setMessage } = messagesSlice.actions;
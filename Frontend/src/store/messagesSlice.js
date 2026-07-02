import formatTime from "../utils/formatTime";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    byConversationId: {
        /* convoId: [
        {
            messageId
            message: "", 
            messageCreator: "", 
            referenceMessage: "", 
            referenceMessageCreator: "", 
            isOwn: true, 
            time: "11:11", 
            readByAt: [{userId, readTime}]
        }]
        */
    }
}

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        updateNewMessage: (state, action) => {
            const { convoId, messageId, message, messageCreator, referenceMessage, referenceMessageCreator, isOwn, time, readByAt } = action.payload;
            // Ensure array exists
            if(!state.byConversationId[convoId]) {
                state.byConversationId[convoId] = [];
            }

            // Push new message
            state.byConversationId[convoId].push({ messageId, message, messageCreator, referenceMessage, referenceMessageCreator, isOwn, time, readByAt: readByAt || [] });
        },
        updateOldMessage: (state, action) => {
            const { oldMessages, userId, convoId } = action.payload;
            const normalizedBatch = oldMessages.map(msg => ({
                messageId: msg._id,
                message: msg.text || msg.encryptedText,
                messageCreator: msg.senderId?._id || msg.senderId,
                referenceMessage: msg.referenceMessage || null,
                referenceMessageCreator: msg.referenceMessageCreator || null,
                isOwn: userId === msg.senderId?._id,
                time: formatTime(msg.createdAt), 
                readByAt: msg.readByAt
            }));
            if(!state.byConversationId[convoId]){
                state.byConversationId[convoId] = normalizedBatch;
                return;
            } 
            state.byConversationId[convoId] = [...normalizedBatch, ...state.byConversationId[convoId]];
        },
        updateReadReceipt: (state, action) => {
            const { convoId, messageId, readerUsername, readerId, readTime } = action.payload;

            // Find that message
            const targetMessage = state.byConversationId[convoId]?.find(msg => msg.messageId === messageId);
            
            // ensure target message exists
            if (!targetMessage) return;

            // ensure targetMessage readByAt array exists
            if(!targetMessage.readByAt) {
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
        },
        resetMessages: () => initialState
    }
})

export default messagesSlice.reducer;
export const { updateNewMessage, updateOldMessage, updateReadReceipt, setMessage, resetMessages } = messagesSlice.actions;
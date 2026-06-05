import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    byConversationId: {
        convoId: [{message: "", messageCreator: "", referenceMessage: "", referenceMessageCreator: ""}]
    }
}

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        updateMessage: (state, action) => {
            const { convoId, message, messageCreator, referenceMessage, referenceMessageCreator } = action.payload;
            // Ensure array exists
            if(!state.byConversationId[convoId]) {
                state.byConversationId[convoId] = [];
            }

            // Push new message
            state.byConversationId[convoId].push({ message, messageCreator, referenceMessage, referenceMessageCreator });
        },
        setMessage: (state, action) => {
            const { convoId, message, messageCreator, referenceMessage, referenceMessageCreator } = action.payload;
            state.byConversationId[convoId] = { message, messageCreator, referenceMessage, referenceMessageCreator };
        }
    }
})

export default messagesSlice.reducer;
export const { updateMessage, setMessage } = messagesSlice.actions;
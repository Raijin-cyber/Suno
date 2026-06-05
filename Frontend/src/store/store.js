import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conversationsReducer from "./conversationsSlice";
import messagesReducer from "./messagesSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        conversations: conversationsReducer,
        messages: messagesReducer,
    }
});

export default store;
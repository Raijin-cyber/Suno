import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conversationsReducer from "./conversationsSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        conversations: conversationsReducer,
    }
});

export default store;
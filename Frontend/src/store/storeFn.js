import { resetConversations } from "./conversationsSlice";
import { resetMessages } from "./messagesSlice";
import { logout } from "./authSlice";
import store from "./store";

const resetStore = () => {
    store.dispatch(resetConversations());
    store.dispatch(resetMessages());
    store.dispatch(logout());
    return null;
}

export {
    resetStore
}
import { CONVO_API } from "../config/config";
import api from "../utils/axios";

// @ desc: POST creates a conversation with a user or a group of users 
const createConversation = async(convoType, userB_ID, participants_ID) => {
    try {
        // participants_ID is an array
        const response = await api.post(CONVO_API.create, { convoType, userB_ID, participants_ID }, { withCredentials: true });
        return response.data.conversation;
    } catch (error) {
        console.error("Error creating the conversation", error.message);
        return error;
    }
}

// @ desc: POST fetches all of the user's conversations (direct and groups)
const getAllUserConversation = async() => {
    try {
        const response = await api.post(CONVO_API.get, {}, { withCredentials: true });
        return response.data.conversations;
    } catch (error) {
        console.error("Error getting user's conversations", error.message);
        return error;
    }
}

// @ desc: PUT updates a conversation mostly for groups (e.g. removing user, changing admin)
const updateConversation = async() => {
    // const conversation = await api.put()
}

// @ desc: DELTE deletes a conversation with a user
const deleteConversation = async() => {
    // const conversation = await api.delete()
}

export {
    createConversation,
    getAllUserConversation,
    updateConversation,
    deleteConversation,
}



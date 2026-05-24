import { CONVO_API } from "../config/config";
import api from "../utils/axios";

// @ desc: POST creates a conversation with a user or a group of users 
const createConversation = async() => {
    const conversation = await api.post(CONVO_API.create);
}

// @ desc: POST fetches all of the user's conversations (direct and groups)
const getConversation = async() => {
    const conversation = await api.post()
}

// @ desc: PUT updates a conversation mostly for groups (e.g. removing user, changing admin)
const updateConversation = async() => {
    const conversation = await api.put()
}

// @ desc: DELTE deletes a conversation with a user
const deleteConversation = async() => {
    const conversation = await api.delete()
}




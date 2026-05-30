import MESSAGE_API from "../config/config";
import api from "../utils/axios";

// @desc POST Creates a message document on each send message and then stores it on the DB.
// @params accepts two params, id -> conversation ID, encryptedMessage -> this is the text which we need to store
const storeMessage = async(id, encryptedMessage) => {
    try {
        const response = await api.post(`${MESSAGE_API.create}/${id}/create`, { encryptedMessage }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error storing messages on the database", error);
        return error;
    }
}

// @desc GET Creates a message document on each send message and then stores it on the DB.
// @params accepts one params, id -> conversation ID
const fetchMessage = async(id) => {
    try {
        const response = await api.get(`${MESSAGE_API.get}/${id}/get`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching messages from the database", error);
        return error;
    }
}

// @desc PUT Updates a message document stored on the DB.
// @params accepts three params, id -> conversation ID, msgId -> message ID, newEncryptedMessage -> this is the text which we want to update
const updateMessage = async(id, msgId, newEncryptedMessage) => {
    try {
        const response = await api.put(`${MESSAGE_API.update}/${id}/update/${msgId}`, { newEncryptedMessage }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error updating message on the database", error);
        return error;
    }
}

// @desc DELETE Deletes a message document stored on the DB.
// @params accepts three params, id -> conversation ID, msgId -> message ID, newEncryptedMessage -> this is the text which we want to update
const deleteMessage = async(id, msgId) => {
    try {
        const response = await api.delete(`${MESSAGE_API.delete}/${id}/delete/${msgId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error deleting message on the database", error);
        return error;
    }
}

export {
    storeMessage,
    fetchMessage,
    updateMessage,
    deleteMessage,
}
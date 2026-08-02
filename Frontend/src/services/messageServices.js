import getAxiosErrorMessage from "../utils/getAxiosErrorMessage";
import { MESSAGE_API } from "../config/config";
import api from "../utils/axios";

// @desc POST Creates a message document on each send message and then stores it on the DB.
// @params accepts two params, id -> conversation ID, encryptedMessage -> this is the text which we need to store
const storeMessage = async({ id, encryptedMessage, referenceMessageId }) => {
    try {
        const response = await api.post(`${MESSAGE_API.create}/${id}/create`, { encryptedMessage, referenceMessageId }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

// @desc GET Get all messages for the user of all conversations.
// @params accepts 3 params, id -> conversation ID, limit, lastMessageId
const fetchMessage = async(id, limit, lastMessageId) => {
    try {
        const response = await api.get(`${MESSAGE_API.get}/${id}/get/?lastMessageId=${lastMessageId}&limit=${limit}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

// @desc GET Gets all unread messages of the user of all conversations.
// @params accepts one params, id -> conversation ID
const fetchUnreadMessage = async(id) => {
    try {
        const response = await api.get(`${MESSAGE_API.getUnread}/${id}/unrd-msg`, { withCredentials: true });
        return response.data.unreadMessages;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

// @desc PATCH Marks document as Read.
// @params accepts 3 params
const markAsReadMessage = async(messageId, readerId, readerUsername, readTime) => {
    try {
        const response = await api.patch(MESSAGE_API.read, { messageId, readerId, readerUsername, readTime }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

// @desc PUT Updates a message document stored on the DB.
// @params accepts three params, id -> conversation ID, msgId -> message ID, newEncryptedMessage -> this is the text which we want to update
const updateMessage = async(id, msgId, newEncryptedMessage) => {
    try {
        const response = await api.put(`${MESSAGE_API.update}/${id}/update/${msgId}`, { newEncryptedMessage }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

// @desc DELETE Deletes a message document stored on the DB.
// @params accepts three params, id -> conversation ID, msgId -> message ID, newEncryptedMessage -> this is the text which we want to update
const deleteMessage = async(id, msgId) => {
    try {
        const response = await api.delete(`${MESSAGE_API.delete}/${id}/delete/${msgId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

export {
    storeMessage,
    fetchMessage,
    fetchUnreadMessage,
    markAsReadMessage,
    updateMessage,
    deleteMessage,
}
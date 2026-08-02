import getAxiosErrorMessage from "../utils/getAxiosErrorMessage";
import { REQUEST_API } from "../config/config";
import api from "../utils/axios";

// @desc sends a request by creating a new request
const sendRequest = async(senderID, receiverID) => {
    try {
        const response = await api.post(REQUEST_API.send, { senderID, receiverID }, { withCredentials: true });
        return response.data.result;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

// @desc accepts a request
const acceptRequest = async(requestID) => {
    try {
        const response = await api.put(REQUEST_API.accept, { requestID }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

const getRequestStatus = async() => {
    try {
        const response = await api.get(REQUEST_API.status, { withCredentials: true });
        return response.data.result;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

// @desc deletes a request
const deleteRequest = async(requestId, userID) => {
    try {
        const response = await api.delete(REQUEST_API.delete, { requestId, userID }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

export {
    sendRequest,
    acceptRequest,
    getRequestStatus,
    deleteRequest,
}
import getAxiosErrorMessage from "../utils/getAxiosErrorMessage";
import { NOTIFICATION_API } from "../config/config";
import api from "../utils/axios";
import { combineSlices } from "@reduxjs/toolkit";

// @desc POST send notification
const sendNotification = async(userB_ID, type, requestID) => {
    try {
        const response = await api.post(NOTIFICATION_API.send, { userB_ID, type, requestID }, { withCredentials: true });
        return response.data.result;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

// @desc POST receive notification
const receiveNotification = async() => {
    try {
        const response = await api.get(NOTIFICATION_API.receive, {}, { withCredentials: true });
        return response.data.result;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

// @desc POST read notification
const readNotification = async() => {
    try {
        const response = await api.put(NOTIFICATION_API.read, {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw new Error(getAxiosErrorMessage(error));
    }
}

export {
    sendNotification,
    readNotification,
    receiveNotification
}
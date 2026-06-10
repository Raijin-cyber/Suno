import { NOTIFICATION_API } from "../config/config";
import api from "../utils/axios";

// @desc POST send notification
const sendNotification = async(userB_ID, type, requestID) => {
    try {
        const response = await api.post(NOTIFICATION_API.send, { userB_ID, type, requestID }, { withCredentials: true });
        return response.data.result;
    } catch (error) {
        console.error("Error occured while sending notification", error.message);
        return error;
    }
}

// @desc POST receive notification
const receiveNotification = async() => {
    try {
        const response = await api.get(NOTIFICATION_API.receive, {}, { withCredentials: true });
        return response.data.result;
    } catch (error) {
        console.error("Error occured while receivin notifignotification", error.message);
        return error;
    }
}

// @desc POST read notification
const readNotification = async() => {
    try {
        const response = await api.put(NOTIFICATION_API.read, {}, { withCredentials: true });
        return;
    } catch (error) {
        console.error("Error occured while marking unread messages as read.")
    }
}

export {
    sendNotification,
    readNotification,
    receiveNotification
}
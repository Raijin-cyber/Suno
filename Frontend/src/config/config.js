export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AUTH_API = {
    register: API_BASE_URL + "auth/register",
    login: API_BASE_URL + "auth/login",
    curruser: API_BASE_URL + "auth/curruser",
    refresh: API_BASE_URL + "auth/refresh",
    logout: API_BASE_URL + "auth/logout",
    update: API_BASE_URL + "auth/update",
    delete: API_BASE_URL + "auth/delete",
    search: API_BASE_URL + "auth/search?query="
}

export const CONVO_API = {
    create: API_BASE_URL + "convo/create",
    get: API_BASE_URL + "convo/get",
    update: API_BASE_URL + "convo/update/:id",
    delete: API_BASE_URL + "convo/delete/:id",
}

export const MESSAGE_API = {
    create: API_BASE_URL + "message", // message/:id/create
    get: API_BASE_URL + "message", // message/:id/get
    update: API_BASE_URL + "message", //message/:id/update/:msgId
    delete: API_BASE_URL + "message", //message/:id/delete/:msgId
}

export const REQUEST_API = {
    send: API_BASE_URL + "request/send",
    accept: API_BASE_URL + "request/accept",
    status: API_BASE_URL + "request/status",
    delete: API_BASE_URL + "request/delete",
}

export const NOTIFICATION_API = {
    send: API_BASE_URL + "notification/send",
    receive: API_BASE_URL + "notification/receive",
    read: API_BASE_URL + "notification/read",
}

export const USER_CONVERSATION_API = {
    fetch: API_BASE_URL + "userconvo", // "/userconvo/:userId/:convoId"
    update: API_BASE_URL + "userconvo", // "/userconvo/:userId/:convoId"
}
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AUTH_API = {
    register: API_BASE_URL + "auth/register",
    login: API_BASE_URL + "auth/login",
    curruser: API_BASE_URL + "auth/curruser",
    refresh: API_BASE_URL + "auth/refresh",
    logout: API_BASE_URL + "auth/logout",
    update: API_BASE_URL + "auth/update",
    delete: API_BASE_URL + "auth/delete"
}
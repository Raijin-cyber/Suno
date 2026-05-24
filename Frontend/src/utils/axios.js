import axios from "axios";
import store from "../store/store";
import { AUTH_API } from "../config/config";
import { login, logout } from "../store/authSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

api.defaults.withCredentials = true;


// refreshing access token logic
api.interceptors.response.use(
    res => res,
    async(error) => {
        const org_request = error.config;

        if(error.response?.status === 403 && !org_request._retry) {
            org_request._retry = true;
            try {
                await axios.post(AUTH_API.refresh, {}, { withCredentials: true });               
                const response = await axios.get(AUTH_API.curruser, { withCredentials: true });
                store.dispatch(login(response.data.userData));

                return api(org_request);

            } catch (error) {
                store.dispatch(logout());
            }
        }
        return Promise.reject(error);
    }
)

export default api;

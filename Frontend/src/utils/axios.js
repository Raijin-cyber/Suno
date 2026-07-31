import axios from "axios";
import store from "../store/store";
import { AUTH_API } from "../config/config";
import { logout } from "../store/authSlice";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        error ? prom.reject(error) : prom.resolve();
    })

    failedQueue = [];
}

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config;

        if(originalRequest && (error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
           
            if(isRefreshing) {
                // Queue the request until the refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ 
                        resolve: () => resolve(api(originalRequest)), 
                        reject 

                    });
                })
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(AUTH_API.refresh, {}, { withCredentials: true });               
                processQueue(null);
                return api(originalRequest);
            } 
            catch (refreshError) {
                processQueue(refreshError);
                // redirect to login
                store.dispatch(logout());
                // window.location.href = "/auth";
                return Promise.reject(refreshError);
            }
            finally {
                isRefreshing = false;
            }

        }
        
        return Promise.reject(error);
    }
)

export default api;

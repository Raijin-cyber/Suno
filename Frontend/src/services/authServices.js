// Authentication Services
// This file will contain the methods for interacting with backend
// Ultimately these methods will talk to the server and feed the result to the UI
// And take data from the UI and send it to the backend

import { AUTH_API } from "../config/config";
import api from "../utils/axios";

// @ desc: POST register user 
const registerUser = async(username, email, password) => {
    try {
        if(!username || !email || !password) console.error("All fields are required!");

        // TODO: Add two keys one private and other is public. Store private to user's device and send the public key to the server

        const newUser = await api.post(AUTH_API.register, {username, email, password, publicKey: "xcvxcvxvsdczsd"});
        if(newUser) console.log("New user created successfully", newUser);
    } catch (error) {
        console.error("Invalid response or request", error.message);
    }
}

// @ desc: POST log-ins user
const loginUser = async(email, password) => {
    try {
        if(!email || !password) console.error("Email or password missing!");
        const response = await api.post(AUTH_API.login, {email, password}, {withCredentials: true});

        // TODO: Store the access, refresh, private key on the client-side
        
        if(response) {
            console.log("User logged-in successfully", response);
            return response;
        }
    } catch (error) {
        console.error("Invalid response or request", error.message);
        throw error;
    }
}

// @ desc: GET gets current user
const getCurrentUser = async() => {
    try {
        return await api.get(AUTH_API.curruser, {withCredentials: true});
    } catch (error) {
        console.error("Invalid response or request", error.message);
        throw error;
    }
}

// @ desc: POST get an access token
const getAccessToken = async() => {
    try {
        
    } catch (error) {
        
    }
}

// @ desc: POST logs-out user
const logoutUser = async() => {
    try {
        const response = await api.post(AUTH_API.logout, {withCredentials: true});
        if(response) {
            console.log("User logged-out successfully", response);
            return response;
        }
    } catch (error) {
        console.error("Failed to log-out", error.message);
        throw error;
    }
}

// @ desc: POST searches for a user by their username
const searchUser = async(username) => {
    try {
        const response = await api.get(AUTH_API.search + username, { withCredentials: true });
        return response.data.results;
    } catch (error) {
        console.error("Error occured while querying the user", error.message);
    }
}

export {
    registerUser,
    loginUser,
    getCurrentUser,
    getAccessToken,
    logoutUser,
    searchUser
}

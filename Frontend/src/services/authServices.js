// Authentication Services
// This file will contain the methods for interacting with backend
// Ultimately these methods will talk to the server and feed the result to the UI
// And take data from the UI and send it to the backend

import axios from "axios";
import { AUTH_API } from "../config/config";

// @ desc: POST register user 
const registerUser = async(username, email, password) => {
    try {
        if(!username || !email || !password) console.error("All fields are required!");

        // TODO: Add two keys one private and other is public. Store private to user's device and send the public key to the server

        const newUser = await axios.post(AUTH_API.register, {username, email, password, publicKey: "xcvxcvxvsdczsd"});
        if(newUser) console.log("New user created successfully", newUser);
    } catch (error) {
        console.error("Invalid response or request", error);
    }
}

// @ desc: POST log-ins user
const loginUser = async(email, password) => {
    try {
        if(!email || !password) console.error("Email or password missing!");
        const response = await axios.post(AUTH_API.login, {email, password});

        // TODO: Store the access, refresh, private key on the client-side
        
        if(response) {
            console.log("User logged-in successfully", response);
            return response;
        }
    } catch (error) {
        console.error("Invalid response or request", error);
        throw error;
    }
}

export {
    registerUser,
    loginUser
}

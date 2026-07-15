import express from "express";
import validateToken from "../middlewares/validateToken.js";
import { 
    registerUser, 
    loginUser,
    googleAuthStart,
    googleAuthCallbackHandler,
    githubAuthStart, 
    githubAuthCallbackHandler,
    getCurrentUser, 
    refreshToken, 
    logoutUser, 
    updateUser, 
    deleteUser, 
    searchUser,
} from "../controllers/authControllers.js";

const authRoutes = express.Router();

// these routes are public and don't require to validate token
authRoutes.route("/register").post(registerUser);

authRoutes.route("/login").post(loginUser); 

authRoutes.route("/refresh").post(refreshToken); 

// OAuth2 based authentication and authorization
// OAuth2 and OIDC flow, following server flow, not the implicit flow

// Google
authRoutes.route("/google").get(googleAuthStart);
authRoutes.route("/google/callback").get(googleAuthCallbackHandler);
// Github
authRoutes.route("/github").get(githubAuthStart);
authRoutes.route("/github/callback").get(githubAuthCallbackHandler);

// applying a middleware, all request will first go through this middleware
authRoutes.use(validateToken);

authRoutes.route("/curruser").get(getCurrentUser); // a user can exist with an expired token

authRoutes.route("/logout").post(logoutUser);

authRoutes.route("/update").put(updateUser);

authRoutes.route("/delete").delete(deleteUser);

authRoutes.route("/search").get(searchUser);

export default authRoutes;
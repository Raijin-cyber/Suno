import express from "express";
import validateToken from "../middlewares/validateToken.js";
import { registerUser, loginUser, refreshToken, logoutUser, updateUser, deleteUser } from "../controllers/authControllers.js";

const authRoutes = express.Router();

// these routes are public and don't require to validate token
authRoutes.route("/register").post(registerUser)

authRoutes.route("/login").post(loginUser) 

authRoutes.route("/refresh").post(refreshToken) 

// applying a middleware, all request will first go through this middleware
authRoutes.use(validateToken);

authRoutes.route("/logout").post(logoutUser)

authRoutes.route("/update").put(updateUser)

authRoutes.route("/delete").delete(deleteUser)

export default authRoutes;
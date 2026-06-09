import express from "express";
import validateToken from "../middlewares/validateToken.js";
import { fetchUserConversationDetails, updateUserConversationDetails } from "../controllers/userConversationControllers.js";

const userConversationRoutes = express.Router();

userConversationRoutes.use(validateToken);

userConversationRoutes.route("/:userId/:convoId").get(fetchUserConversationDetails);

userConversationRoutes.route("/:userId/:convoId").patch(updateUserConversationDetails);

export default userConversationRoutes;
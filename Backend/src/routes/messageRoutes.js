import express from "express";
import validateToken from "../middlewares/validateToken.js";
import { createMessage, getMessage, updateMessage, deleteMessage } from "../controllers/messageControllers.js";

const messageRoutes = express.Router();

messageRoutes.use(validateToken);

messageRoutes.route("/:id/create").post(createMessage);

messageRoutes.route("/:id/get").get(getMessage);

messageRoutes.route("/:id/update/:msgId").put(updateMessage);

messageRoutes.route("/:id/delete/:msgId").delete(deleteMessage);

export default messageRoutes;
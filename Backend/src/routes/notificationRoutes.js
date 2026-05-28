import express from "express";
import validateToken from "../middlewares/validateToken.js";
import { sendNotification, receiveNotification, readNotification } from "../controllers/notificationControllers.js";

const notificationRoutes = express.Router();

notificationRoutes.use(validateToken);

notificationRoutes.route("/send").post(sendNotification);

notificationRoutes.route("/read").put(readNotification);

notificationRoutes.route("/receive").get(receiveNotification);

export default notificationRoutes;
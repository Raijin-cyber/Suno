import express from "express";
import validateToken from "../middlewares/validateToken.js";
import { sendRequest, acceptRequest, getRequestStatus, deleteRequest } from "../controllers/requestControllers.js";

const requestRoutes = express.Router();

requestRoutes.use(validateToken);

requestRoutes.route("/send").post(sendRequest);

requestRoutes.route("/accept").put(acceptRequest);

requestRoutes.route("/status").get(getRequestStatus);

requestRoutes.route("/delete").delete(deleteRequest);

export default requestRoutes;
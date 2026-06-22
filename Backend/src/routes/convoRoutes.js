import express from "express";
import validateToken from "../middlewares/validateToken.js";
import { createConvo, getAllConvo, updateConvo, deleteConvo } from "../controllers/convoControllers.js";

const convoRoutes = express.Router();

// protecting all routes signing a middleware name Validate Token
convoRoutes.use(validateToken);

convoRoutes.route("/create").post(createConvo);

convoRoutes.route("/get").post(getAllConvo);

convoRoutes.route("/update/:id").put(updateConvo);

convoRoutes.route("/delete/:id").delete(deleteConvo);

export default convoRoutes;

// INDEPENDENT EVOLUTION IS THE GOAL

// FUTURE UPDATE
/*
    PATCH /convo/:id/last-message
    POST /convo/:id/members
    DELETE /convo/:id/members
    PATCH /convo/:id/admin 
*/
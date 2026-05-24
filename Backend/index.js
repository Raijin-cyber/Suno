// neccessary modules
import express from "express";
import http from "http";
import cors from "cors";
import configSocket from "./src/socket/index.js";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import { Server } from "socket.io";
import connectDB from "./database/dbConnection.js";

// routes
import authRoutes from "./src/routes/authRoutes.js";
import convoRoutes from "./src/routes/convoRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import requestRoutes from "./src/routes/requestRoutes.js";

configDotenv(); // loads .env's content in process.env

const PORT = process.env.PORT || 5000;

const app = express(); // this creates an express application
const httpServer = http.createServer(app); // adding the functionality of our express such as route handling, adding middlewares, parsing, handling file uploads etc.
export const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    }
}); // creating a new instance socket.io using raw version of HTTP server

configSocket(io); // configuing the web socket connection

app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(express.json()); // to parse all incoming request with valid JSON data type will be eventually converted to the JSON format.
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/convo", convoRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/request", requestRoutes);

// start the http server only if the database is ready to connect
connectDB()
.then(() => {
    httpServer.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}/api/v1`));
});
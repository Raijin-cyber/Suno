// neccessary modules
import http from "http";
import cors from "cors";
import Redis from "ioredis";
import "./src/config/env.js";
import express from "express";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import configSocket from "./src/socket/index.js";
import connectDB from "./database/dbConnection.js";
import errorHandler from "./src/middlewares/errorHandler.js";

// routes
import authRoutes from "./src/routes/authRoutes.js";
import convoRoutes from "./src/routes/convoRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";
import requestRoutes from "./src/routes/requestRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import userConversationRoutes from "./src/routes/userConversationRoutes.js";

const PORT = process.env.PORT || 5000;

const app = express(); // this creates an express application
const httpServer = http.createServer(app); // adding the functionality of our express such as route handling, adding middlewares, parsing, handling file uploads etc.
export const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", process.env.FRONTEND_HOST],
        credentials: true
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
    }
}); // creating a new instance socket.io using raw version of HTTP server

configSocket(io); // configuing the web socket connection

app.use(cors({origin: ["http://localhost:5173", process.env.FRONTEND_HOST], credentials: true}));
app.use(express.json()); // to parse all incoming request with valid JSON data type will be eventually converted to the JSON format.
app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/convo", convoRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/request", requestRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/userconvo", userConversationRoutes);
app.use(errorHandler);

// start the http server only if the database is ready to connect
connectDB(5, 10000)
.then(() => {
    httpServer.listen(PORT, () => console.log(`Server is listening on ${process.env.NODE_ENV === "development" ? `http://localhost:${PORT}/api/v1` : `https://orbi-ji1n.onrender.com`}`));
});

// connect caching server (in this case, caching server is Valkey)
export const redis = new Redis(
    {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
        tls: {}
    }
);

redis.on("connecting", () => console.log("Trying to connect to caching server..."));
redis.on("connect", () => console.log("Caching server connected"));
redis.on("reconnecting", () => console.log("Caching server reconnected"));
redis.on("error", (error) => console.log("Redis Error: ", error));
redis.on("end", () => console.log("Redis connection closed"));

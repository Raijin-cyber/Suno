// neccessary modules
import express from "express";
import http from "http";
import cors from "cors";
import { configDotenv } from "dotenv";
import { Server } from "socket.io";
import connectDB from "./database/dbConnection.js";

// routes
import authRoutes from "./src/routes/authRoutes.js";

configDotenv(); // loads .env's content in process.env

const PORT = process.env.PORT || 5000;

const app = express(); // this creates an express application
const httpServer = http.createServer(app); // adding the functionality of our express such as route handling, adding middlewares, parsing, handling file uploads etc.
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173"]
    }
}); // creating a new instance socket.io using raw version of HTTP server

app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json()); // to parse all incoming request with valid JSON data type will be eventually converted to the JSON format.
app.use("/auth", authRoutes);

// start the http server only if the database is ready to connect
connectDB()
.then(() => {
    httpServer.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));
});
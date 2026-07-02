// mongoose is that library which is used to handle two things.
// 1. To make model of entities or say schemas.
// 2. To establish the connection from your codebase to the remote database provided by mongoDB

import mongoose from "mongoose";

const connectDB = async(retries, baseTimeout) => {
    try {
        mongoose.connection.on("connecting", () => console.log("Server is starting... \nTrying to connect to the database..."));
        mongoose.connection.on("reconnected", () => console.log("Database reconnected with the server successfully."));
        const connectionRef = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected: ", connectionRef.connection.host, connectionRef.connection.name);
    } catch (error) {
        // base case
        if(retries === 0) {
            console.log("*** Server is shutting down ***");
            process.exit(1); // terminate the server
        }
        if(retries > 0) {
            setTimeout(() => {
                console.error("Database failed to connect: ",error);
                console.log(`Trying to reconnect again with the database in ${baseTimeout} seconds.`, error);
                connectDB(retries - 1, baseTimeout + 10000); // try to reconnect 
            }, baseTimeout);            
        }
    }
};

export default connectDB;

import {loadServerMemory, playersDB, roomsDB, mapsDB, playerSockets, socketPlayers} from "./serverMemory.js";
import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";

//import { processClientRequest } from "./serverRequestFromClient.js";
import { startWebSocket } from "./serverNetwork.js";
console.log("______________________________________________________________");
console.log("______________________________________________________________");
console.log("______________________________________________________________");
console.log("Server starting...");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
    console.log("______________________________________________________________");
    console.log("______________________________________________________________");
});

const server = http.createServer(app);

try {
    await loadServerMemory();
    startWebSocket(server);
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server started: http://localhost:${PORT}`);
        console.log("______________________________________________________________");
    });

} catch (error) {console.error("Server memory loading failed:", error);}


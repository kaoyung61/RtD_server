import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { processClientRequest } from "./clientRequest.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/game", async (req, res) => {
    const answer = await processClientRequest(req.body);
    res.json(answer);
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
});




// ------- Web Socket server -------
const server = http.createServer(app);
startWebSocket(server);
server.listen(PORT);
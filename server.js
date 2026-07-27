import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";

import { processClientRequest } from "./clientRequest.js";
import { startWebSocket } from "./network.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.post("/api/game", async (req,res)=>{

    const result = await processClientRequest(req.body);

    res.json(result);

});


app.get("/", (req,res)=>{
    res.send("Server is running");
});


const server = http.createServer(app);

startWebSocket(server);


server.listen(
    process.env.PORT || 3000,
    ()=>{
        console.log("Server started");
    }
);
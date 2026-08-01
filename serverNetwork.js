import { WebSocketServer, WebSocket } from "ws";
import { processWebSocketRequest } from "./serverRequestFromClient.js";

const players = new Map();

export function startWebSocket(server) {
    const wss = new WebSocketServer({ server });
    wss.on("connection", socket => {
        console.log("Client connected");
        socket.on("message", message => {
            const data = JSON.parse(message);
            receiveMessage(socket, data);
        });
        socket.on("close", () => {
            if (socket.playerName) {
                players.delete(socket.playerName);
                console.log(`${socket.playerName} disconnected`);
            }
        });
    });
}

function receiveMessage(socket, data) {
    processWebSocketRequest(socket, data);
}


export function sendToSocket(socket, data) {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.log("Socket not connected");
        return false;
    }

    socket.send(JSON.stringify(data));
    return true;
}


export function sendToPlayer(playerToken, data) {
    const socket = players.get(playerToken);

    if (!socket) {
        console.log(`Player '${playerToken}' not found`);
        return false;
    }

    return sendToSocket(socket, data);
}

export function sendToAll(data) {
    for (const socket of players.values()) {
        socket.send(JSON.stringify(data));
    }
}
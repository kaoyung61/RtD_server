import { WebSocketServer, WebSocket } from "ws";
import { processWebSocketRequest } from "./serverRequestFromClient.js";

const players = new Map();

export function startWebSocket(server) {
    const wss = new WebSocketServer({ server });
    wss.on("connection", socket => {
        console.log("Client connected");

        socket.on("message", message => {
            try {
                const data = JSON.parse(message);
                receiveMessage(socket, data);
            } catch (error) {
                sendToSocket(socket, {
                    type: "error",
                    data: "Invalid request format"
                });
            }
        });

        socket.on("close", () => {
            if (socket.playerToken) {
                players.delete(socket.playerToken);
                console.log(`${socket.playerToken} disconnected`);
            }
        });
    });
}

function receiveMessage(socket, data) {
    processWebSocketRequest(socket, data);
}


export function authorizePlayer(socket, token) {
    // проверка токена в базе

    const success = true; // результат проверки

    if (success) {
        socket.playerToken = token;
        players.set(token, socket);

        sendToSocket(socket, {
            type: "auth_success"
        });
    }
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
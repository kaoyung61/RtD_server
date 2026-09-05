import { WebSocketServer, WebSocket } from "ws";
import { clientRequest } from "./serverRequestFromClient.js";
import {players, rooms, maps, playerSockets, socketPlayers} from "./serverMemory.js";

export function startWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", socket => {
        console.log("Client connected");
        sendToSocket(socket, { command: "requestToken" });

        socket.on("message", message => {
            try {
                receiveMessage(socket, JSON.parse(message.toString()));
            } catch (error) {
                console.log("Server error:", error);
                sendToSocket(socket, { type: "error", data: "Server error" });
            }
        });

        socket.on("close", () => disconnectPlayer(socket));
        socket.on("error", error => console.log("Socket error:", error));
    });
}

export function registerPlayer(socket, playerId) {
    if (!playerId) { console.log("Player has no ID"); return false; }

    const oldSocket = playerSockets.get(playerId);
    if (oldSocket && oldSocket !== socket) socketPlayers.delete(oldSocket);

    const oldPlayerId = socketPlayers.get(socket);
    if (oldPlayerId && oldPlayerId !== playerId && playerSockets.get(oldPlayerId) === socket) playerSockets.delete(oldPlayerId);

    playerSockets.set(playerId, socket);
    socketPlayers.set(socket, playerId);

    console.log(`Player '${playerId}' registered`);
    console.log("Connected players:", [...playerSockets.keys()]);
    return true;
}

export function getPlayerId(socket) {
    return socketPlayers.get(socket);
}

export function sendToPlayer(playerId, data) {
    console.log("Searching:", playerId);
    console.log("Registered:", [...playerSockets.keys()]);
    
    const socket = playerSockets.get(playerId);
    if (!socket) { console.log(`Player '${playerId}' not found`); return false; }

    console.log(`Player '${playerId}' found`);
    return sendToSocket(socket, data);
}

export function sendToSocket(socket, data) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;

    try {
        socket.send(JSON.stringify(data));
        return true;
    } catch (error) {
        console.log("Send error:", error);
        return false;
    }
}

function disconnectPlayer(socket) {
    const playerId = socketPlayers.get(socket);
    socketPlayers.delete(socket);

    if (!playerId) return;
    if (playerSockets.get(playerId) === socket) playerSockets.delete(playerId);

    console.log(`Player '${playerId}' disconnected`);
}

function receiveMessage(socket, data) {
    clientRequest(socket, data);
}
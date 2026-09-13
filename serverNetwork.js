import { WebSocketServer, WebSocket } from "ws";
import { clientRequest } from "./serverRequestFromClient.js";
import {playersDB, roomsDB, mapsDB, playerSockets, socketPlayers} from "./serverMemory.js";

export function startWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", socket => {
        console.log("[WEBSOCKET] New Socket connected");
        //sendToSocket(socket, { command: "requestToken" });

        socket.on("message", message => {
            console.log("[IN ]", message.toString());
            try {
                receiveMessage(socket, JSON.parse(message.toString()));
            } catch (error) {
                console.log("[IN  ] ERROR:", error);
                sendToSocket(socket, { type: "error", data: "Server error" });
            }
        });

        socket.on("close", () => {
            console.log("[WEBSOCKET] Socket closed");
            disconnectPlayer(socket);
        });
        socket.on("error", error => console.log("[WEBSOCKET] ERROR:", error));
    });
}

export function registerPlayer(socket, playerId) {
    if (!playerId) { console.log("[REG ] Player has no ID"); return false; }

    const oldSocket = playerSockets.get(playerId);
    if (oldSocket && oldSocket !== socket) socketPlayers.delete(oldSocket);

    const oldPlayerId = socketPlayers.get(socket);
    if (oldPlayerId && oldPlayerId !== playerId && playerSockets.get(oldPlayerId) === socket) playerSockets.delete(oldPlayerId);

    playerSockets.set(playerId, socket);
    socketPlayers.set(socket, playerId);

    console.log(`[ REG ] Player '${playerId}' registered`);
    console.log("[ MEMORY ] Connected players:", [...playerSockets.keys()]);
    return true;
}

export function getPlayerId(socket) {
    return socketPlayers.get(socket);
}

export function sendToPlayer(playerId, data) {
    //console.log("func sendToPlayer: Searching:", playerId);
    //console.log("func sendToPlayer: Registered:", [...playerSockets.keys()]);
    console.log("[ SEND ] sendToPlayer: ", playerId," data:", data);

    const socket = playerSockets.get(playerId);
    if (!socket) { console.log(`[SEND] ERROR sendToPlayer: Player '${playerId}' not found`); return false; }

    //console.log(`func sendToPlayer: Player '${playerId}' found`);
    return sendToSocket(socket, data);
}

export function sendToSocket(socket, data) {
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;

    try {
        socket.send(JSON.stringify(data));
        return true;
    } catch (error) {
        console.log("[SEND] ERROR sendToSocket:", error);
        return false;
    }
}

function disconnectPlayer(socket) {
    const playerId = socketPlayers.get(socket);
    socketPlayers.delete(socket);

    if (!playerId) return;
    if (playerSockets.get(playerId) === socket) playerSockets.delete(playerId);

    console.log(`[DISCONNECT] Player '${playerId}' disconnected`);
}

function receiveMessage(socket, data) {
    clientRequest(socket, data);
}
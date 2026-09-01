import { WebSocketServer, WebSocket } from "ws";
import { processWebSocketRequest } from "./serverRequestFromClient.js";

const players = new Map();

export function startWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", socket => {
        console.log("Client connected");

        // Сервер сразу запрашивает токен
        sendToSocket(socket, {command: "requestToken"});

        socket.on("message", message => {
            console.log("RAW:", message.toString());

            let data;

            try {
                data = JSON.parse(message.toString());
            } catch (error) {
                console.log("JSON error:", error);
                sendToSocket(socket, {type: "error",data: "Invalid JSON"});
                return;
            }

            try {
                receiveMessage(socket, data);
            } catch (error) {
                console.log("Server error:", error);

                sendToSocket(socket, {
                    type: "error",
                    data: "Server error"
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



export function registerPlayer(socket, playerToken) {

    // Пустой токен не регистрируем
    if (!playerToken) {console.log("Player has no token");return false;}

    // Сохраняем токен в самом socket
    socket.playerToken = playerToken;

    // Сохраняем связь:
    // token -> socket
    players.set(playerToken, socket);
    console.log(`Player '${playerToken}' registered`);
    console.log("Current players:", Array.from(players));
    return true;
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
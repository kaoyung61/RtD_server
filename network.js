import { WebSocketServer } from "ws";

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
    console.log("Client message:", data);
    switch (data.type) {
        case "setName":
            if (socket.playerName) {players.delete(socket.playerName);}
            socket.playerName = data.name;
            players.set(data.name, socket);
            console.log(`${data.name} registered`);
            break;

        case "message":
            sendToPlayer(data.to, {
                type: "message",
                from: socket.playerName,
                text: data.text
            });
            break;

    }

}

export function sendToPlayer(playerName, data) {
    const socket = players.get(playerName);
    if (!socket) {
        console.log(`Player '${playerName}' not found`);
        return;
    }
    socket.send(JSON.stringify(data));
}

export function sendToAll(data) {
    for (const socket of players.values()) {
        socket.send(JSON.stringify(data));
    }
}
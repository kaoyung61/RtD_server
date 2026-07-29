import { sendToPlayer } from "../network.js";

const players = new Map();

export function setName(socket, request) {

    if (socket.playerName) {
        players.delete(socket.playerName);
    }
    socket.playerName = request.name;
    players.set(request.name, socket);

    console.log(`${request.name} registered`);

}

export function message(socket, request) {
    const target = players.get(request.to);
    if (!target) {
        console.log(`Player '${request.to}' not found`);
        return;
    }
    target.send(JSON.stringify({
        type: "message",
        from: socket.playerName,
        text: request.text
    }));

}

export function sendTerritoryInfo(socket, request) {
    const target = players.get(request.to);
    if (!target) {
        console.log(`Player '${request.to}' not found`);
        return;
    }
    console.log(request);
    territoriesInfo=readDatabaseObject("maps","id",1,"territories")
    serverAntwort=JSON.stringify(territoriesInfo[request.number])

    target.send(JSON.stringify({
        type: "terrInfo",
        from: socket.playerName,
        text: serverAntwort
    }));
}
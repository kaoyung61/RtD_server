import { sendToSocket, sendToPlayer } from "../serverNetwork.js";
import { readDatabaseObject } from "../serverDatabase.js";


export async function CR_loginClient(socket, request) {
    console.log("CR_loginClient start");
    let player = await readDatabaseObject("players", "login", request.data.login, "*");
    console.log("CR_loginClient: player:", player);
    if (player.password === request.data.password) {
        sendToSocket(socket, { command: "token", token: player.token });
        sendLobby(socket, player.token);
    } else {
        sendToSocket(socket, { command: "error", type: "login" });
    };
    console.log("CR_loginClient end");

}

export async function CR_authoriseMe(socket, request) {
    console.log("CR_authoriseMe start");
    sendToSocket(socket, { command: "message", text: "CR_authoriseMe: Authorisation angefragt" });
    console.log("CR_authoriseMe end");
}


export async function CR_newClientRegistration(socket, request) {
    console.log("CR_newClientRegistration start");
    sendToSocket(socket, { command: "message", text: "CR_newClientRegistration: Neuer Client registriert" });
    console.log("CR_newClientRegistration end");
}


export async function sendLobby(socket, token) {
    console.log("sendLobby start");
    let playerID = await readDatabaseValue("players", "token", token, "id");
    let playerRoomsID = await readDatabaseValue("players", "token", token, "rooms");
    console.log("sendLobby: playerRoomsID:", playerRoomsID);
    let playerRooms = [];
    for (let n of playerRoomsID) {
        let roomID = await readDatabaseObject("rooms", "id", n, "id");
        let roomName = await readDatabaseObject("rooms", "id", n, "name");
        let roomMap = await readDatabaseObject("rooms", "id", n, "map");
        let room = {
            id: roomID,
            name: roomName,
            map: roomMap
        };
        playerRooms.push(room);
        console.log("sendLobby: playerRooms: ",n, " ", playerRooms);
    }
    sendToSocket(socket, { command: "rooms", rooms: playerRooms });
    console.log("sendLobby end");
}
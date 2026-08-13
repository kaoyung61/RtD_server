import { sendToSocket, sendToPlayer } from "../serverNetwork.js";
import { readDatabaseObject, readDatabaseValue } from "../serverDatabase.js";


export async function CR_loginClient(socket, request) {
    //console.log("CR_loginClient start");
    let player = await readDatabaseObject("players", "login", request.data.login, "*");
    //console.log("CR_loginClient: player:", player);
    if (player.password === request.data.password) {
        sendToSocket(socket, { command: "token", token: player.token });
        sendLobby(socket, player.token);
    } else {
        sendToSocket(socket, { command: "error", type: "login" });
    };
    //console.log("CR_loginClient end");

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

export async function CR_getLobby(socket, request) {
    console.log("CR_getLobby start");
    let playerToken = await readDatabaseValue("players", "token", request.token, "id");
    sendLobby(socket, playerToken);
    console.log("CR_getLobby end");
}


export async function CR_connectRoom(socket, request) {
    console.log("CR_connectRoom start");
    let playerID = await readDatabaseValue("players", "token", request.token, "id");
    let playerRoomsID = await readDatabaseValue("players", "token", request.token, "rooms");
    let roomID = Number(request.data.roomID);
    console.log("Player _" + playerID + "_ connecting to room _" + roomID + "_");
    console.log("Available rooms for player _" + playerID + "_ : _", playerRoomsID+ "_");
    if (playerRoomsID.includes(roomID)) {
        sendToPlayer(playerID, { command: "connectRoom", access: true });
        console.log("Player _" + playerID + "_ connecting to room _" + roomID + "_");
    } else {
        sendToSocket(socket, { command: "error", text: "Player is not allowed to connect to this room" });
        console.log("Error: Player _" + playerID + "_ is not allowed to connect to room _" + roomID + "_");
    }
    console.log("CR_connectRoom end");
}



export async function sendLobby(socket, token) {
    console.log("sendLobby start");
    let playerRoomsID = await readDatabaseValue("players", "token", token, "rooms");
    console.log("sendLobby: playerRoomsID:", playerRoomsID);
    let playerRooms = [];
    for (let n of playerRoomsID) {
        let roomID = n;
        let roomName = await readDatabaseValue("rooms", "id", n, "name");
        let roomMap = await readDatabaseValue("rooms", "id", n, "map");
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
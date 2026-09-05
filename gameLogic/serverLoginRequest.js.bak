import { sendToSocket, sendToPlayer } from "../serverNetwork.js";
import { readDatabaseObject, readDatabaseValue } from "../serverDatabase.js";
import { registerPlayer, getPlayerId} from "../serverNetwork.js";
import {players, rooms, maps, playerSockets, socketPlayers} from "./serverMemory.js";
import {readMemoryValue, updateMemoryValue} from "./serverMemory.js";



export async function client_loginOnServer(socket, data) {
    //console.log("CR_loginClient start");
    let player = readMemoryValue(players, "login", data.login, "*");
    //console.log("CR_loginClient: player:", player);
    if (player.password === data.password) {
        sendToSocket(socket, { command: "token", token: player.token });
        //registerPlayer(socket, Number(player.id));
        //sendLobby(socket, player.token);
    } else {
        sendToSocket(socket, { command: "errLogin", type: "login" });
    };
    //console.log("CR_loginClient end");

}

export async function client_authoriseOnServer(socket, data) {
    console.log("client_authoriseOnServer start");
    const playerID = readMemoryValue(players, "token", data.token, "id");

    if (!playerID) {
        sendToSocket(socket, { command: "errAuth", text: "Authorisation failed" });
        console.log("Authorisation failed");
        return false;
    }

    registerPlayer(socket, Number(playerID));
    sendToSocket(socket, { command: "auth", success: true });
    console.log("Authorisation successful");
    return true;
}


export async function client_newRegistration(socket, data) {
    console.log("client_newRegistration start");
    sendToSocket(socket, { command: "message", text: "client_newRegistration: Neuer Client not registriert" });
    console.log("client_newRegistration end");
}

export async function client_connectRoom(socket, request) {
    console.log("client_connectRoom start");
    let playerID = getPlayerId(socket);
    let playerRoomsID = readMemoryValue(players, "id", playerID, "rooms");
    let roomID = Number(request.data.roomID);
    console.log("Player _" + playerID + "_ connecting to room _" + roomID + "_");
    console.log("Available rooms for player _" + playerID + "_ : _", playerRoomsID+ "_");
    if (playerRoomsID.includes(roomID)) {
        let room = {
            id: roomID,
            name: readMemoryValue(rooms, "id", roomID, "name"),
            map: readMemoryValue(rooms, "id", roomID, "map")
        };
        sendToPlayer(playerID, { command: "RoomConnection", room: room });
        //sendRoomState(playerID, roomID);
        console.log("Player _" + playerID + "_ connecting to room _" + room.id + "_");

    } else {
        sendToPlayer(playerID, { command: "errRoomConnection", text: "Player is not allowed to connect to this room" });
        console.log("Error: Player _" + playerID + "_ is not allowed to connect to room _" + roomID + "_");
    }
    console.log("client_connectRoom end");
}


export async function client_requestLobby(socket, request) {
    console.log("client_requestLobby start");
    let playerID = getPlayerId(socket);
    sendLobby(playerID);
    console.log("client_requestLobby end");
}


export async function sendLobby(playerID) { 
    console.log("sendLobby for player " + playerID + " start");
    let playerRoomsID = readMemoryValue(players, "id", playerID, "rooms");
    console.log("playerRoomsID:", playerRoomsID);
    let playerRooms = [];
    for (let n of playerRoomsID) {
        let roomID = n;
        let roomName = readMemoryValue(rooms, "id", n, "name");
        let roomMap = readMemoryValue(rooms, "id", n, "map");
        let room = {
            id: roomID,
            name: roomName,
            map: roomMap
        };
        playerRooms.push(room);
        console.log("sendLobby: playerRooms: ",n, " ", playerRooms);
    }
    sendToPlayer(playerID, { command: "lobby", rooms: playerRooms });
    console.log("sendLobby for player " + playerID + " end");
}
 

export async function sendRoomState(playerID, RoomID) {
    let roomID = Number(RoomID);
    let roomName = readMemoryValue(rooms, "id", roomID, "name");
    let roomMap = readMemoryValue(rooms, "id", roomID, "map");
    let gameState = readMemoryValue(rooms, "id", roomID, "gameState");
    let playerState = readMemoryValue(rooms, "id", roomID, "playerState");
    let territoriesState = readMemoryValue(rooms, "id", roomID, "territories");

    let dataToSend = {
        roomID: roomID,
        roomName: roomName,
        roomMap: roomMap,
        gameState: gameState,
        playerState: playerState,
        territoriesState: territoriesState
    };
    sendToPlayer(playerID, { command: "roomState", data: dataToSend })
    //sendToSocket(socket, { command: "roomState", data: dataToSend });

}




export async function client_requestMapData(socket, request) { // функция отсылает данные карты любому 
    console.log("client_requestMapData start");
    let roomMapInfo = readMemoryValue(maps, "name", request.map, "*");
    sendToSocket(socket, { command: "mapData", data: roomMapInfo });
    console.log("client_requestMapData end");
}

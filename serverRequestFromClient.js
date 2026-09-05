import {playersDB, roomsDB, mapsDB, playerSockets, socketPlayers} from "./serverMemory.js";

import {    client_loginOnServer,
            client_authoriseOnServer,
            client_newRegistration,

            client_requestLobby,
            client_connectRoom,
            
            client_requestRoomState,
            client_requestMapData
        } from "./gameLogic/serverLoginRequest.js";





export async function clientRequest(socket, request) {
    switch (request.command) {

        //
        // from "./gameLogic/serverLoginRequest.js";
        //
        case "loginOnServer":
            return client_loginOnServer(socket, request.data);

        case "authoriseOnServer":
            return client_authoriseOnServer(socket, request.data);

        case "newClientRegistration":
            return client_newRegistration(socket, request.data);



        case "requestLobby":
            return client_requestLobby(socket, request);

        case "connectRoom":
            return client_connectRoom(socket, request);

        case "requestMapData":
            return client_requestMapData(socket, request);
        
        case "requestRoomState":
            return client_requestRoomState(socket, request);


        //
        // ELSE
        //
        default:
            console.log("Unknown request: ", request);

    }

}
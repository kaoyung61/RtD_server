//import { attack } from "./gameLogic/attack.js";
import { setName } from "./gameLogic/testServer.js";
import { sendTerritoryInfo } from "./gameLogic/testServer.js";
//import { start } from "./gameLogic/start.js";


export async function processClientRequest(request){

    switch(request.command){

        case "login":
            return await start(request);

        case "getLobby":
            return await attack(request);

        case "getMap":
            return await move(request);

        default:

            return {
                success:false,
                error:"Unknown command"
            };
    }
};

export function processWebSocketRequest(socket, request) {

    switch (request.type) {

        case "setName":
            return setName(socket, request);

        case "message":
            return message(socket, request);

        case "attack":
            return attack(socket, request); //???
        
        case "territoryInfo":
            return sendTerritoryInfo(socket, request);

        default:
            console.log("Unknown request:", request.type);

    }

}
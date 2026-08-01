//import { attack } from "./gameLogic/attack.js";
import { playerlogin } from "./gameLogic/auth_script.js";
//import { sendTerritoryInfo } from "./gameLogic/testServer.js";
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

        

        default:
            console.log("Unknown request:", request.type);

    }

}
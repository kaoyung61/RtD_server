//import { attack } from "./gameLogic/attack.js";
//import { playerlogin } from "./gameLogic/auth_script.js";
import { CR_authoriseMe, CR_loginClient, CR_newClientRegistration } from "./gameLogic/serverLoginRequest.js";

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

/*
authoriseMe
loginClient
newClientRegistration
*/




export function processWebSocketRequest(socket, request) {
    console.log("processWebSocketRequest ", socket, " called with request:", request);
    switch (request.type) {

        case "authoriseMe":
            return CR_authoriseMe(socket, request);

        case "loginClient":
            return CR_loginClient(socket, request);

        case "newClientRegistration":
            return CR_newClientRegistration(socket, request);

        default:
            console.log("Unknown request");

    }

}
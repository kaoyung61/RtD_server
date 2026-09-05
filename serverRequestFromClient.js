//import { attack } from "./gameLogic/attack.js";
//import { playerlogin } from "./gameLogic/auth_script.js";
import { CR_authoriseMe, CR_loginClient, CR_newClientRegistration, CR_connectRoom} from "./gameLogic/serverLoginRequest.js";
import { registerPlayer } from "./serverNetwork.js";



export async function clientRequest(socket, request) {
    switch (request.command) {

        case "authoriseMe":
            return CR_authoriseMe(socket, request);

        case "loginClient":
            return CR_loginClient(socket, request);

        case "newClientRegistration":
            return CR_newClientRegistration(socket, request);

        case "connectRoom":
            return CR_connectRoom(socket, request);

        case "registerPlayer":
            return registerPlayer(socket, request.token);
        
        //case "getMap":
        //    return CR_getLobby(socket, request);

        default:
            console.log("Unknown request: ", request);

    }

}
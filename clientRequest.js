//import { start } from "./gameLogic/start.js";
//import { move } from "./gameLogic/move.js";
import { attack } from "./gameLogic/attack.js";
//import { hire } from "./gameLogic/hire.js";
//import { endTurn } from "./gameLogic/endTurn.js";

export async function processClientRequest(request) {

    switch (request.command) {

        case "start":
            return await start(request);

        case "move":
            return await move(request);

        case "attack":
            return await attack(request);

        case "hire":
            return await hire(request);

        case "end":
            return await endTurn(request);




            
        default: return {success: false,error: "Unknown command"};
    }
}
import { attack } from "./gameLogic/attack.js";
//import { move } from "./gameLogic/move.js";
//import { start } from "./gameLogic/start.js";


export async function processClientRequest(request){

    switch(request.command){

        case "start":
            return await start(request);

        case "attack":
            return await attack(request);

        case "move":
            return await move(request);

        default:

            return {
                success:false,
                error:"Unknown command"
            };
    }
}
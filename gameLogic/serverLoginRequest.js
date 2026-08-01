import { sendToSocket, sendToPlayer } from "../serverNetwork.js";
import { readDatabaseObject } from "./serverDatabase.js";


export function CR_loginClient(socket, request) {
    console.log("CR_loginClient start");
    let player = readDatabaseObject("players", "login", request.data.login, "*");
    if (player.pasword === request.data.password) {
        sendToSocket(socket, { command: "token", token: player.token });
    } else {
        sendToSocket(socket, { command: "error", type: "login" });
    }
    console.log("CR_loginClient end");

}

export function CR_authoriseMe(socket, request) {
    console.log("CR_authoriseMe start");
    sendToSocket(socket, { command: "message", text: "CR_authoriseMe: Authorisation angefragt" });
    console.log("CR_authoriseMe end");
}


export function CR_newClientRegistration(socket, request) {
    console.log("CR_newClientRegistration start");
    sendToSocket(socket, { command: "message", text: "CR_newClientRegistration: Neuer Client registriert" });
    console.log("CR_newClientRegistration end");
}



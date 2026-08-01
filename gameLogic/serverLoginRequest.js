import { sendToSocket, sendToPlayer } from "../serverNetwork.js";



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


export function CR_loginClient(socket, request) {
    console.log("CR_loginClient start");
    sendToSocket(socket, { command: "message", text: "CR_loginClient: Client eingeloggt" });
    console.log("CR_loginClient end");

}
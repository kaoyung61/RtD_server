import {WebSocketServer} from "ws";

let clients=[];

export function startWebSocket(server){

    const wss=new WebSocketServer({server});

    wss.on("connection",socket=>{
        clients.push(socket);
    });
}


export function broadcast(data){

    clients.forEach(client=>{
        client.send(JSON.stringify(data));
    });
}
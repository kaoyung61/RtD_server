import { WebSocketServer } from "ws";

let clients = [];


export function startWebSocket(server){

    const wss = new WebSocketServer({
        server
    });


    wss.on("connection",socket=>{

        console.log("Client connected");

        clients.push(socket);


        socket.on("message",message=>{

            const data =
                JSON.parse(message);


            receiveMessage(
                socket,
                data
            );

        });


        socket.on("close",()=>{

            clients =
            clients.filter(
                client => client !== socket
            );

        });

    });

}


function receiveMessage(socket,data){

    console.log(
        "Client message:",
        data
    );

    /*
    позже:

    switch(data.event){

        case "login":
            ...

    }

    */
}



export function sendToPlayer(socket,data){

    socket.send(
        JSON.stringify(data)
    );

}



export function sendToAll(data){

    clients.forEach(socket=>{

        sendToPlayer(
            socket,
            data
        );

    });

}
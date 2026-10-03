import { sendToPlayer } from "../serverNetwork.js";
import { sendALL_roomUPD   } from "./serverLoginRequest.js";
import { getPlayerId} from "../serverNetwork.js";
import {playersDB, roomsDB, mapsDB, playerSockets, socketPlayers} from "../serverMemory.js";
import {readMemoryValue, updateMemoryValue} from "../serverMemory.js";





export async function client_requestMove(socket, requestData){
    
    //console.log(requestData);
    //1. check if request ist ok - sicherheit
    
    let playerID = getPlayerId(socket);
    requestData.playerID=playerID;
    let roomInfo = await readMemoryValue(roomsDB, "id", requestData.roomID, "*");
    console.log("--------------------------------------------roomInfo")
    console.log(roomInfo)
    if (playerID !==roomInfo.gameState.playerOrder[roomInfo.gameState.activePlayer-1]){ return sendToPlayer(playerID, { command: "errMove_Wrong_activePlayer", text: "Its not your turn!" });}

    //2. move = update info in RAM
    let territories_NEW = roomInfo.territoriesState;
    let playerState_NEW = roomInfo.playersState;
    //console.log(territoriesState_NEW) 
    //boss
    
    if (requestData.boss){
        playerState_NEW.find(p => p.id === playerID).boss.pos = requestData.toTerrID;
        playerState_NEW.find(p => p.id === playerID).boss.active = false;
    }
    //general
    if (requestData.general){
        const generals = playerState_NEW.find(p => p.id === playerID).generals;
        const general = generals.find(g => g.pos === requestData.fromTerrID);

        if (general) {
            general.active = false;
            general.pos = requestData.toTerrID;
        }

    }
    updateMemoryValue(roomsDB, requestData.roomID, "playersState", playerState_NEW)
    //bandits
    //a += 2; b -= 3;
    territories_NEW.find(t => t.id === requestData.fromTerrID).bandits -= requestData.bandits;
    territories_NEW.find(t => t.id === requestData.fromTerrID).activeBandits -= requestData.bandits;
    territories_NEW.find(t => t.id === requestData.toTerrID).bandits += requestData.bandits;
    updateMemoryValue(roomsDB, requestData.roomID, "territoriesState", territories_NEW)
    
    //3. update dataBase - is in updateMemoryValue

    //4. send to all players in room updatet state
    sendALL_roomUPD("move", requestData);
    
}



export async function client_requestNextPhase(socket, requestData){
    /*
    sendtoServer("requestNextPhase", {roomID: activeGameState.roomID, playerID: myPlayerInfo.id});
    */
    //console.log(roomsDB)

    let playerID = getPlayerId(socket);
    let roomInfo = readMemoryValue(roomsDB, "id", requestData.roomID, "*");

    //console.log(roomInfo)

    if (playerID !==roomInfo.gameState.playerOrder[roomInfo.gameState.activePlayer-1]){ return sendToPlayer(playerID, { command: "errNextPhase_Wrong_activePlayer", text: "Its not your turn!" });}
    roomInfo.territoriesState.forEach(terr => {
        terr.activeBandits = terr.bandits;
    })
    await updateMemoryValue(roomsDB, roomInfo.id, "territoriesState", roomInfo.territoriesState)
    
    roomInfo.gameState.activePhase += 1;
    if (roomInfo.gameState.activePhase > 4) {
        roomInfo.gameState.activePhase = 0;
        //roomInfo.gameState.activePlayer += 1;
        if (roomInfo.gameState.activePlayer > roomInfo.gameState.playerOrder.length) {
            roomInfo.gameState.activePlayer = 1;
        }
    }

    roomInfo.playersState.forEach(player => {
        player.boss.active = true;
        player.generals.forEach(general => {
            general.active = true;
        })

    })

    await updateMemoryValue(roomsDB, roomInfo.id, "gameState", roomInfo.gameState);
    let dataToSend = {
        roomID: roomInfo.id,
        activePlayer: roomInfo.gameState.playerOrder[roomInfo.gameState.activePlayer-1],
        activePhase: roomInfo.gameState.phaseOrder[roomInfo.gameState.activePhase],
    }
    console.log(dataToSend);

    if (dataToSend.activePhase === "balance") {
        let playerMoney=roomInfo.playersState.find(p => p.id === dataToSend.activePlayer).money;
        let playerGenerals=roomInfo.playersState.find(p => p.id === dataToSend.activePlayer).generals.length;
        let playerBandits=0;
        let playerTerritories =0;
        let playerMonopoly=0;

        roomInfo.territoriesState.forEach(territory => {
            if (territory.owner === playerID) {
                playerTerritories += 1;
                playerBandits += territory.bandits;
            }
        });
    
        
        dataToSend.balance = updatePlayerBalance(dataToSend.activePlayer, dataToSend.roomID);

        roomInfo.playersState.find(p => p.id === dataToSend.activePlayer).balance = dataToSend.balance;

        await updateMemoryValue(roomsDB, roomInfo.id, "playersState", roomInfo.playersState);
        
    }


    sendALL_roomUPD("nextPhase", dataToSend);
    //console.log(roomInfo);

}


export function updatePlayerBalance(PlayerID, roomID)    {
    let roomInfo = readMemoryValue(roomsDB, "id", roomID, "*");
    let playerInfo = roomInfo.playersState.find(p => p.id === PlayerID);

    let playerGenerals = playerInfo.generals.length;
    let playerMoney = playerInfo.balance.playerMoney;
    let playerBandits = 0;
    let playerTerritories = 0;
    let playerMonopoly = 0;

    const regions = new Map();

    roomInfo.territoriesState.forEach(territory => {
        const region = territory.region;

        if (!regions.has(region)) {
            regions.set(region, { total: 0, owned: 0 });
        }

        const group = regions.get(region);
        group.total += 1;

        if (territory.owner === PlayerID) {
            playerTerritories += 1;
            playerBandits += territory.bandits;
            group.owned += 1;
        }
    });

    for (const group of regions.values()) {
        if (group.total === 8 && group.owned === 8) {
            playerMonopoly += 1;
        }
    }

    let priceInfo = {
        territoriesPrice: 50,
        monopolyPrice: 100,
        generalsPrice: -40,
        banditsPrice: -20
    };

    let playerMoneyNextMove = playerTerritories*priceInfo.territoriesPrice + playerMonopoly*priceInfo.monopolyPrice + playerBandits*priceInfo.banditsPrice + playerGenerals*priceInfo.generalsPrice

    let balanceInfo = {
        playerMoney: playerMoney+playerMoneyNextMove,
        playerMoneyNextMove: playerMoneyNextMove,
        playerTerritories: playerTerritories,
        playerMonopoly: playerMonopoly,
        playerBandits: playerBandits,
        playerGenerals: playerGenerals,
        prices: priceInfo
    }
    

    return balanceInfo;
}
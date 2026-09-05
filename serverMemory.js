// serverMemory.js

// import {players, rooms, maps, playerSockets, socketPlayers} from "./serverMemory.js";
// import {readMemoryValue, updateMemoryValue} from "./serverMemory.js";

import { updateDatabaseValue } from "./serverDatabase.js";

export const playerSockets = new Map(); // playerId -> socket
export const socketPlayers = new Map(); // socket -> playerId

export const playersDB = new Map();
export const roomsDB = new Map();
export const mapsDB = new Map();

export async function loadServerMemory() {
    const dbPlayers = await readDatabaseTable("players");
    const dbRooms = await readDatabaseTable("rooms");
    const dbMaps = await readDatabaseTable("maps");

    for (const player of dbPlayers) playersDB.set(player.id, player);
    for (const room of dbRooms) roomsDB.set(room.id, room);
    for (const map of dbMaps) mapsDB.set(map.id, map);
}

export function readMemoryValue(memoryMap, searchColumn, searchValue, returnColumn) {
    for (const object of memoryMap.values()) {
        if (object[searchColumn] === searchValue) return object[returnColumn] ?? null;
    }
    return null;
}

export async function updateMemoryValue(memoryMap, id, column, value) {
    const object = memoryMap.get(id);
    if (!object) { console.log(`Memory object '${id}' not found`); return false; }

    const tableName = memoryMap.name.replace("DB", "");
    const success = await updateDatabaseValue(tableName, "id", id, column, value);
    if (!success) { console.log(`Database update failed: ${tableName}.${column}, ID '${id}'`); return false; }

    object[column] = value;
    return true;
}
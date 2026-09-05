import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import {playersDB, roomsDB, mapsDB, playerSockets, socketPlayers} from "./serverMemory.js";

dotenv.config();

const db = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

export async function readDatabaseObject(
    table,
    searchColumn,
    searchValue,
    resultColumns = "*"
) {

    const { data, error } = await db
        .from(table)
        .select(resultColumns)
        .eq(searchColumn, searchValue)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;

}

export async function readDatabaseValue(
    table,
    searchColumn,
    searchValue,
    resultColumn
) {

    const data = await readDatabaseObject(
        table,
        searchColumn,
        searchValue,
        resultColumn
    );

    return data ? data[resultColumn] : null;

}

export async function writeDatabaseObject(
    table,
    searchColumn,
    searchValue,
    values
) {

    const { data, error } = await db
        .from(table)
        .update(values)
        .eq(searchColumn, searchValue)
        .select()
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;

}

export async function writeDatabaseValue(
    table,
    searchColumn,
    searchValue,
    resultColumn,
    resultValue
) {

    return await writeDatabaseObject(
        table,
        searchColumn,
        searchValue,
        {
            [resultColumn]: resultValue
        }
    );

}

export async function insertDatabaseObject(
    table,
    values
) {

    const { data, error } = await db
        .from(table)
        .insert(values)
        .select()
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;

}


export async function readDatabaseTable(tableName) {
    const { data, error } = await supabase.from(tableName).select("*");

    if (error) { console.error(`Database error: ${error.message}`); return null; }
    return data;
}

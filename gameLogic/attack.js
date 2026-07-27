import {
    readDatabaseObject,
    readDatabaseValue,
    writeDatabaseObject,
    writeDatabaseValue,
    insertDatabaseObject
} from "../database.js";

export async function attack(request) {

    // ============================================================
    // Request
    // ============================================================

    const playerId = request.player;
    const roomId = request.room;
    const data = request.data;
    

    // ============================================================
    // Read database
    // ============================================================

    // const player = await readDatabaseObject(
    //     "users",
    //     "id",
    //     playerId
    // );

    // const territory = await readDatabaseObject(
    //     "territories",
    //     "id",
    //     data.territory
    // );

    // ============================================================
    // Validation
    // ============================================================

    // if (!player)
    //     return fail("Player not found");

    // if (!territory)
    //     return fail("Territory not found");

    // ============================================================
    // Game logic
    // ============================================================

    // ...

    // ============================================================
    // Database update
    // ============================================================

    // await writeDatabaseValue(...);

    // await writeDatabaseObject(...);

    // ============================================================
    // Response
    // ============================================================

    return ok({
        message: "Function xyz completed"
    });

}



// ============================================================
// Helper functions
// ============================================================

function ok(data = null) {

    return {
        success: true,
        data,
        error: null
    };

}

function fail(error) {

    return {
        success: false,
        data: null,
        error
    };

}
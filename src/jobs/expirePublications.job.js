const cron = require("node-cron");
const Publication = require("../models/publication.model");
const Postulation = require("../models/postulation.model");

// execute every day at midnight example every 5 minutes: */5 * * * *
//             .---------------- minute (0 - 59)
//             | .------------- hour (0 - 23)
//             | | .---------- day of month (1 - 31)
//             | | | .------- month (1 - 12)
//             | | | | .---- day of week (0 - 6) (Sunday=0 or 7)
//             | | | | |
cron.schedule("5 0 * * *", async () => {
    try {
        const now = new Date();

        // 1. change AVAILABLE to EXPIRED and ASSIGNED to COMPLETED in publicationDays of OPEN publications 
        // and change status of publication to EXPIRED
        const result1 = await Publication.updateMany(
            {
                endDate: { $lt: now },
                status: "OPEN"
            },
            {
                $set: {
                    status: "EXPIRED",
                    "publicationDays.$[expired].status": "EXPIRED",
                    "publicationDays.$[completed].status": "COMPLETED"
                }
            },
            {
                arrayFilters: [
                    { "expired.status": "AVAILABLE" },
                    { "completed.status": "ASSIGNED" }
                ]
            }
        );
        console.log(`Publicaciones OPEN expiradas: ${result1.modifiedCount}`);

        // 2. change status of FILLED publications to COMPLETED
        const result2 = await Publication.updateMany(
            {
                endDate: { $lt: now },
                status: "FILLED"
            },
            {
                $set: {
                    status: "COMPLETED",
                    "publicationDays.$[elem].status": "COMPLETED"
                }
            },
            {
                arrayFilters: [
                    { "elem.status": "ASSIGNED" }
                ]
            }
        );
        console.log(`Publicaciones FILLED completadas: ${result2.modifiedCount}`);

        // 3. change status of PENDING postulations to CANCELED
        const result3 = await Postulation.updateMany(
            {
                status: "PENDING",
                postulationDays: { $elemMatch: { date: { $lt: now } } }
            },
            {
                $set: { status: "CANCELED" }
            }
        );
        console.log(`Postulaciones PENDING canceladas: ${result3.modifiedCount}`);
        console.log("Publicaciones y postulaciones actualizadas correctamente");

    } catch (error) {
        console.error("Error al expirar/completar publicaciones:", error);
    }
});

const soda = require('soda-js');
const {
    filterLocationsWithinRadius,
    transformCoordinates,
} = require('./helpers');

const consumer = new soda.Consumer('data.sfgov.org');

exports.handler = async (event) => {
    try {
        // Default query: get all approved food trucks
        let where = "facilitytype = 'Truck' AND status = 'APPROVED'";
        const foodItem = event?.queryStringParameters?.foodItem ?? '';
        let truckName = event?.queryStringParameters?.truckName ?? '';

        // Filter by food item or truck name
        if (foodItem) {
            where = `lower(fooditems) like '%${foodItem.toLowerCase()}%' AND ${where}`;
        } else if (truckName) {
            truckName = truckName.replace(/'/g, "''");
            where = `lower(applicant) like '%${truckName.toLowerCase()}%' AND ${where}`;
        }

        const approvedTrucks = await new Promise((resolve, reject) => {
            consumer
                .query()
                .withDataset('rqzj-sfat')
                .limit(1000)
                .where(where)
                .getRows()
                .on('success', function (rows) {
                    resolve(rows);
                })
                .on('error', function (error) {
                    reject(error);
                });
        });

        if (!approvedTrucks?.length) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No food trucks found' }),
            };
        }

        const trucksLocations = transformCoordinates(approvedTrucks);

        // Filter by radius if latitude, longitude, and radius are provided
        const radius =
            !!event?.queryStringParameters?.radius &&
            parseInt(event?.queryStringParameters?.radius);
        const latitude =
            !!event?.queryStringParameters?.latitude &&
            parseFloat(event?.queryStringParameters?.latitude);
        const longitude =
            !!event?.queryStringParameters?.longitude &&
            parseFloat(event?.queryStringParameters?.longitude);

        const result = await filterLocationsWithinRadius({
            locations: trucksLocations,
            centerPoint: { latitude, longitude },
            radius,
        });

        if (!result.length) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: 'No food trucks found within the radius',
                }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result),
        };
    } catch (error) {
        return {
            statusCode: error?.statusCode || 500,
            body: JSON.stringify({
                message: error?.message || 'An error occurred',
            }),
        };
    }
};

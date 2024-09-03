const soda = require("soda-js");
const {
  filterLocationsWithinRadius,
  transformCoordinates,
} = require("./helpers");

const consumer = new soda.Consumer("data.sfgov.org");

exports.handler = async (event) => {
  const foodItem = event?.queryStringParameters?.foodItem || "";
  const radius = parseInt(event?.queryStringParameters?.radius) || null;
  const latitude = parseFloat(event?.queryStringParameters?.latitude) | null;
  const longitude = parseFloat(event?.queryStringParameters?.longitude) | null;
  let truckName = event?.queryStringParameters?.truckName || "";

  // Default query: get all approved food trucks
  let where = "facilitytype = 'Truck' AND status = 'APPROVED'";
  // Add filters if provided
  if (foodItem) {
    where = `lower(fooditems) like '%${foodItem.toLowerCase()}%' AND ${where}`;
  } else if (truckName) {
    truckName = truckName.replace(/'/g, "''");
    where = `lower(applicant) like '%${truckName.toLowerCase()}%' AND ${where}`;
  }

  try {
    const approvedTrucks = await new Promise((resolve, reject) => {
      consumer
        .query()
        .withDataset("rqzj-sfat")
        .limit(1000)
        .where(where)
        .getRows()
        .on("success", function (rows) {
          resolve(rows);
        })
        .on("error", function (error) {
          reject(error);
        });
    });

    if (!approvedTrucks?.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No food trucks found" }),
      };
    }

    const trucksLocations = transformCoordinates(approvedTrucks);
    let result;

    if (!latitude || !longitude || !radius) {
      result = trucksLocations;
    } else {
      result = filterLocationsWithinRadius({
        locations: trucksLocations,
        centerPoint: { latitude, longitude },
        radius,
      });
    }

    if (!result.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No food trucks found within the radius",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error?.message || "An error occurred" }),
    };
  }
};

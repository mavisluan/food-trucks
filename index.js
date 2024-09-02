const soda = require("soda-js");
const {
  filterLocationsWithinRadius,
  transformCoordinates,
} = require("./helpers");

const consumer = new soda.Consumer("data.sfgov.org");

exports.handler = async (event) => {
  if (event?.queryStringParameters) {
    foodItem = event?.queryStringParameters?.foodItem || "";
    truckName = event?.queryStringParameters?.truckName || "";
    radius = parseInt(event?.queryStringParameters?.radius) || 5000;
    latitude = parseFloat(event?.queryStringParameters?.latitude) || 37.75;
    longitude = parseFloat(event?.queryStringParameters?.longitude) || -122.38;
  }

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
    const rows = await new Promise((resolve, reject) => {
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

    if (!rows?.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No food trucks found" }),
      };
    }

    const locations = transformCoordinates(rows);
    const locationsWithinRadius = filterLocationsWithinRadius({
      locations,
      centerPoint: { latitude, longitude },
      radius,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(locationsWithinRadius),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error?.message || "An error occurred" }),
    };
  }
};

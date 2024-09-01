const soda = require("soda-js");
const geolib = require("geolib");

const consumer = new soda.Consumer("data.sfgov.org");

async function fetchData({ foodItem, truckName, radius, centerPoint }) {
  let where = "facilitytype = 'Truck' AND status = 'APPROVED'";

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

    const locations = transformCoordinates(rows);
    // console.log(locations);
    console.log(locations.length);

    // Get locations within the specified radius
    const locationsWithinRadius = filterLocationsWithinRadius({
      locations,
      centerPoint,
      radius,
    });

    // console.log(locationsWithinRadius);
    console.log(locationsWithinRadius.length);
  } catch (error) {
    console.error(error);
  }
}

fetchData({
  foodItem: "hot dogs",
  truckName: "senor",
  radius: 5000, // 5 km
  centerPoint: { latitude: 37.75, longitude: -122.38 },
});
// fetchData({ truckName: "Natan's", radius: 5 });

function transformCoordinates(locations) {
  return locations.map((location) => {
    return {
      ...location,
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
    };
  });
}

// Function to filter locations within the radius
function filterLocationsWithinRadius({ locations, centerPoint, radius }) {
  return locations.filter((location) => {
    const distance = geolib.getDistance(
      { latitude: location.latitude, longitude: location.longitude },
      centerPoint
    );
    return distance <= radius;
  });
}

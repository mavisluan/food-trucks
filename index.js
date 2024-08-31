const soda = require("soda-js");
const consumer = new soda.Consumer("data.sfgov.org");

async function fetchData({ foodItem, truckName, radius }) {
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
        .limit(500)
        .where(where)
        .getRows()
        .on("success", function (rows) {
          resolve(rows);
        })
        .on("error", function (error) {
          reject(error);
        });
    });

    console.log(rows);
    console.log(rows.length);
  } catch (error) {
    console.error(error);
  }
}

fetchData({ foodItem: "hot dogs", truckName: "senor", radius: 5 });
// fetchData({ truckName: "Natan's", radius: 5 });

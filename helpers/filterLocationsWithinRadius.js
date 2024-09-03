const geolib = require("geolib");

const filterLocationsWithinRadius = ({ locations, centerPoint, radius }) => {
  locations ??= [];
  if (!centerPoint?.latitude || !centerPoint?.longitude || !radius) {
    return locations;
  }

  if (radius < 0) {
    throw { message: "Invalid radius. Radius can not be negative" };
  }

  return locations.filter((location) => {
    const distance = geolib.getDistance(
      { latitude: location?.latitude, longitude: location?.longitude },
      centerPoint
    );
    return distance <= radius;
  });
};

module.exports = filterLocationsWithinRadius;

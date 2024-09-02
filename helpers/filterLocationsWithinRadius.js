const geolib = require("geolib");

const filterLocationsWithinRadius = ({ locations, centerPoint, radius }) => {
  if (radius < 0) {
    throw { message: "Invalid radius. Radius can not be negative" };
  }
  locations ??= [];
  centerPoint ??= { latitude: 37.75, longitude: -122.38 };
  radius ??= 5000;

  return locations.filter((location) => {
    const distance = geolib.getDistance(
      { latitude: location?.latitude, longitude: location?.longitude },
      centerPoint
    );
    return distance <= radius;
  });
};

module.exports = filterLocationsWithinRadius;

const transformCoordinates = (locations) => {
  locations ??= [];
  return locations.map((location) => {
    return {
      ...location,
      latitude: parseFloat(location?.latitude) || null,
      longitude: parseFloat(location?.longitude) || null,
    };
  });
};

module.exports = transformCoordinates;

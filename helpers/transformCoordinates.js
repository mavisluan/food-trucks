const transformCoordinates = (locations) => {
    locations ??= [];
    // Include number 0 as a valid latitude/longitude
    return locations.map((location) => {
        let latitude = parseFloat(location?.latitude);
        let longitude = parseFloat(location?.longitude);
        latitude = Number.isFinite(latitude) ? latitude : null;
        longitude = Number.isFinite(longitude) ? longitude : null;

        return {
            ...location,
            latitude,
            longitude,
        };
    });
};

module.exports = transformCoordinates;

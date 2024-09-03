const geolib = require('geolib');

const filterLocationsWithinRadius = ({ locations, centerPoint, radius }) => {
    locations ??= [];
    if (!centerPoint?.latitude || !centerPoint?.longitude || !radius) {
        return locations;
    }

    if (radius < 0) {
        throw {
            message: 'Invalid radius. Radius can not be negative',
            statusCode: 400,
        };
    }

    return locations.filter((location) => {
        if (isNaN(location?.latitude) || isNaN(location?.longitude)) {
            return false;
        }

        const isPointWithinRadius = geolib.isPointWithinRadius(
            {
                latitude: location.latitude,
                longitude: location.longitude,
            },
            centerPoint,
            radius
        );

        return isPointWithinRadius;
    });
};

module.exports = filterLocationsWithinRadius;

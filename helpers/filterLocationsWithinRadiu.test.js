const geolib = require("geolib");
const { filterLocationsWithinRadius } = require("./index.js");

// Mock the geolib.getDistance function
jest.mock("geolib", () => ({
  getDistance: jest.fn(),
}));
describe("filterLocationsWithinRadius", () => {
  const centerPoint = { latitude: 37.75, longitude: -122.38 }; // Maryland Street, San Francisco, 94124, USA

  beforeEach(() => {
    geolib.getDistance.mockClear();
  });

  test("should handle null or undefined locations array", () => {
    const result = filterLocationsWithinRadius({
      locations: null,
      centerPoint,
    });
    expect(result).toEqual([]);
  });

  test("should handle invalid centerPoint", () => {
    const locations = [
      { latitude: null, longitude: -74.006 },
      { latitude: 40.7128, longitude: undefined },
    ];
    const result = filterLocationsWithinRadius({
      locations,
      centerPoint: null,
    });
    expect(result).toEqual([]);
  });

  test("should throw an error for invalid radius", () => {
    expect(() =>
      filterLocationsWithinRadius({
        locations: [],
        centerPoint,
        radius: -1,
      })
    ).toThrow("Invalid radius. Radius can not be negative");
  });

  test("should handle large number of locations", () => {
    const locations = Array.from({ length: 10000 }, (_, i) => ({
      latitude: 40.7128 + i * 0.0001,
      longitude: -74.006 + i * 0.0001,
    }));
    geolib.getDistance.mockReturnValue(0);

    const result = filterLocationsWithinRadius({
      locations,
      centerPoint,
      radius: 5000,
    });
    expect(result.length).toBe(10000);
  });

  test("should include locations exactly on the radius boundary", () => {
    const locations = [{ latitude: 40.7128, longitude: -74.006 }];
    geolib.getDistance.mockReturnValue(5000);

    const result = filterLocationsWithinRadius({
      locations,
      centerPoint,
      radius: 5000,
    });
    expect(result).toEqual([{ latitude: 40.7128, longitude: -74.006 }]);
  });

  test("should return locations within the radius", () => {
    const locations = [
      { latitude: 40.7128, longitude: -74.006 }, // New York
      { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
      { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
    ];

    geolib.getDistance.mockReturnValueOnce(100000); // New York
    geolib.getDistance.mockReturnValueOnce(5000); // Los Angeles
    geolib.getDistance.mockReturnValueOnce(1000); // San Francisco

    const result = filterLocationsWithinRadius({
      locations,
      centerPoint,
      radius: 5000,
    });

    expect(result).toEqual([
      { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
      { latitude: 37.7749, longitude: -122.4194 }, // San Francisco
    ]);
  });
});

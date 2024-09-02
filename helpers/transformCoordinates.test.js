const { transformCoordinates } = require("./index.js");

describe("transformCoordinates", () => {
  test("should handle an empty array", () => {
    const locations = [];
    const expected = [];
    expect(transformCoordinates(locations)).toEqual(expected);
  });

  test("should handle missing latitude or longitude", () => {
    const locations = [{ latitude: "34.0522" }, { longitude: "-118.2437" }, {}];
    const expected = [
      { latitude: 34.0522, longitude: null },
      { latitude: null, longitude: -118.2437 },
      { latitude: null, longitude: null },
    ];
    expect(transformCoordinates(locations)).toEqual(expected);
  });

  test("should preserve extra properties", () => {
    const locations = [
      { latitude: "34.0522", longitude: "-118.2437", name: "Los Angeles" },
    ];
    const expected = [
      { latitude: 34.0522, longitude: -118.2437, name: "Los Angeles" },
    ];
    expect(transformCoordinates(locations)).toEqual(expected);
  });

  test("should handle non-array input", () => {
    const locations = null;
    const expected = [];
    expect(transformCoordinates(locations)).toEqual(expected);
  });

  test("should transform the coordinate from string to float number ", () => {
    const locations = [
      { latitude: "34.0522", longitude: "-118.2437" },
      { latitude: "40.7128", longitude: " -74.006" },
    ];
    const expected = [
      { latitude: 34.0522, longitude: -118.2437 },
      { latitude: 40.7128, longitude: -74.006 },
    ];
    expect(transformCoordinates(locations)).toEqual(expected);
  });
});

/**
 * @jest-environment node
 */

const Logic = require("./logic.js");

//Post Route Testcases
describe("Logic Module Tests", () => {
  test("It should be a function and return True", async () => {
    expect(Logic.cleanCountries).toBeDefined();
  });
});

test("It should be a function and return True", async () => {
  expect(Logic.cleanData).toBeDefined();
});

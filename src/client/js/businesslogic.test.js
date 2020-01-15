import "babel-polyfill";
import {
  travelCard,
  isDateValid,
  getLocationInformation
} from "./businesslogic";

//Update UI Testcases
describe("Fronent Rendering Test Cases", () => {
  test("It should be a function and return True", async () => {
    expect(travelCard).toBeDefined();
  });
});

//Map Testcases
describe("Map Element Test Cases", () => {
  test("It should be a function and return True", async () => {
    expect(getLocationInformation).toBeDefined();
  });
});

//Helper function Test Cases
describe("Helper function Testst", () => {
  test("Input is a URL", () => {
    let input = "https://www.4arge.com/";
    expect(isUrlValid(input)).toBeTrue;
  });
  test("Input is a URL", () => {
    let input = "01.01.2020";
    expect(isDateValid(input)).toBeTrue;
  });
});

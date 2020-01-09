import "babel-polyfill";
import { plg, updateUI } from "./businesslogic";
import { text } from "body-parser";

//Update UI Testcases
describe("Update UI Tests", () => {
  test("It should be a function and return True", async () => {
    expect(updateUI).toBeDefined();
  });

  test("It should be a function", async () => {
    expect(typeof updateUI).toBe("function");
  });
});

describe("Helper function Testst", () => {
  test("Input is Equal to Output", () => {
    let input = {
      url: expect.any(String),
      polarity: expect.any(String),
      confidence: expect.any(String),
      text: expect.any(String)
    };
    expect(plg(input)).toEqual(input);
  });

  test("Input is a URL", () => {
    let input = "https://www.4arge.com/";
    expect(isUrlValid(input)).toBeTrue;
  });
});

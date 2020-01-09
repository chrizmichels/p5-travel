import "babel-polyfill";
import { getStarted, postData, updateUI } from "./app";
import { text } from "body-parser";

//Post Route Testcases
describe("postData Route Test", () => {
  test("It should be a function and return True", async () => {
    expect(postData).toBeDefined();
  });

  test("It should be a function", async () => {
    expect(typeof postData).toBe("function");
  });
});

//Update UI Testcases
describe("Update UI Tests", () => {
  test("It should be a function and return True", async () => {
    expect(updateUI).toBeDefined();
  });

  test("It should be a function", async () => {
    expect(typeof updateUI).toBe("function");
  });
});

//Get Started function Testcases
describe("getStarted Function Tests", () => {
  test("It should be a function and return True", async () => {
    expect(getStarted).toBeDefined();
  });

  test("It should be a function", async () => {
    expect(typeof getStarted).toBe("function");
  });
});

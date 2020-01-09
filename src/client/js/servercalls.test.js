import { plg, isUrlValid } from "./helper";





//Post Route Testcases
describe("postData Route Test", () => {
  test("It should be a function and return True", async () => {
    expect(postData).toBeDefined();
  });

  test("It should be a function", async () => {
    expect(typeof postData).toBe("function");
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
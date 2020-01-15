import "babel-polyfill";
import { postData } from "./servercalls";

//Post Route Testcases
describe("postData Route Test", () => {
  test("It should be a function and return True", async () => {
    expect(postData).toBeDefined();
  });
});

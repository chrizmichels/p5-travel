import { plg, isUrlValid } from "./helper";

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

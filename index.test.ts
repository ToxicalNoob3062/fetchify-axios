import axios, { AxiosError } from "axios";
import fetchAdapter from "./index";
import { test, expect, mock, describe } from "bun:test";

//lets mock the fetch function #mocking the dependency
const mockFetch = mock(fetch);

// test for different scenarios:
describe("fetchAdapter", () => {
  // create the adapter
  const adapter = fetchAdapter(mockFetch);

  // create the axios instance
  const client = axios.create({
    baseURL: "https://dummyjson.com",
    adapter,
    withCredentials: true,
  });

  // test for successful request
  test("successful request", async () => {
    //make the request
    const res = await client.get("/users/1");

    //expect status success and header to be application/json
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    expect(res.headers["content-type"]).toContain("application/json");
  });

  // test for failed request
  test("failed request", async () => {
    //make the request
    try {
      await client.get("/potato");
    } catch (err) {
      //expect the error message to be "Network Error"
      expect((err as AxiosError).message).toBe("Not Found");
    }
  });
});

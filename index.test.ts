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
      if (err instanceof AxiosError) {
        //expect status to be 404
        expect(err.response).toBeDefined();
        expect(err.response?.status).toBe(404);
        expect(err.response?.statusText).toBe("Not Found");
      }
    }
  });

  //test post request
  test("post request", async () => {
    //make the request
    const res = await client.post("/users/add", {
      firstName: "John",
      lastName: "Doet",
      age: 25,
    });

    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    expect(res.headers["content-type"]).toContain("application/json");
  });

  //test to check query params
  test("query params", async () => {
    //make the request
    const res = await client.get("/users/search", {
      params: {
        q: "John",
      },
    });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    expect(res.headers["content-type"]).toContain("application/json");
  });

  //test to check set-cookie header
  test("set-cookie header", async () => {
    //make the request
    try {
      const res = await client.post(
        "/user/emp/login",
        {
          email: "rahat3062@gmail.com",
          password: "Rahat123#",
          shopId: "helloShop",
        },
        {
          withCredentials: true,
          baseURL: "http://localhost:4000",
        }
      );
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(300);
      expect(res.headers["content-type"]).toContain("application/json");
      expect(res.headers["set-cookie"]).toBeDefined();
    } catch (err) {
      console.log("I am in error!");
    }
  });
});

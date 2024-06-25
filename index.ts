import fetchParse from "fetch-parse";
import {
  AxiosError,
  type AxiosAdapter,
  type AxiosPromise,
  type AxiosRequestHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
("");

export type fetch = (
  input: URL | Request | string,
  init?: RequestInit
) => Promise<Response>;

function purifyHeaders(headers: AxiosRequestHeaders): Record<string, string> {
  const headersObj: Record<string, string> = {};
  for (const key in headers) {
    if (headers[key] !== undefined) {
      headersObj[key] = headers[key];
    }
  }
  return headersObj;
}

// Axios adapter that can take any fetch implementation
export default function (fetch: fetch): AxiosAdapter {
  fetch = fetchParse(fetch);
  //return the adapter using that fetch implementation
  return async (config: InternalAxiosRequestConfig): AxiosPromise => {
    //get the url from the config
    const url = new URL(config.url!, config.baseURL);
    //append params to the url if they exist
    if (config.params) {
      Object.keys(config.params).forEach((key) =>
        url.searchParams.append(key, config.params[key])
      );
    }

    //to store the headers from Headers object
    let headers: { [key: string]: string } = {};

    //let request object
    const requestOptions: RequestInit = {
      method: config.method,
      body: config.data == undefined ? null : config.data,
      headers: purifyHeaders(config.headers),
      credentials: config.withCredentials ? "include" : "same-origin",
    };

    //create the request object to refer
    const request = new Request(url.toString(), requestOptions);

    //fetch the data
    let response: Response;
    try {
      response = (await Promise.race([
        fetch(url.toString(), requestOptions),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 5000)
        ),
      ])) as Response;

      for (let key of response.headers.keys()) {
        headers[key] = response.headers.get(key)!;
      }

      //if response is not ok, throw an error
      if (!response.ok) {
        const responseObj: AxiosResponse = {
          data: response.body,
          status: response.status,
          statusText: response.statusText,
          headers: headers,
          config,
          request,
        };
        throw new AxiosError(
          `Request failed with status code ${response.status}`,
          response.status.toString(),
          config,
          request,
          responseObj
        );
      }
    } catch (err) {
      if (err instanceof AxiosError) throw err;

      //if the error is not something we can handle, throw a generic error
      throw new AxiosError(
        `An error occurred while making the request. Error: ${
          (err as Error).message
        }`,
        "777 (FETCH_ERROR)",
        config,
        request
      );
    }

    //create the AxiosResponse object
    const axiosRes: AxiosResponse = {
      data: response.body,
      status: response.status,
      statusText: response.statusText,
      headers: headers,
      config,
      request,
    };

    //return the response
    return axiosRes;
  };
}

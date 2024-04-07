import {
  AxiosError,
  type AxiosAdapter,
  type AxiosPromise,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export type fetch = typeof fetch;

// Axios adapter that can take any fetch implementation
export default function (fetch: fetch): AxiosAdapter {
  //return the adapter using that fetch implementation
  return async (config: InternalAxiosRequestConfig): AxiosPromise => {
    const url = (config.baseURL ? config.baseURL : "") + config.url;
    if (!url) {
      throw new AxiosError("no url specified!");
    }

    //to store the headers from Headers object
    let headers: { [key: string]: string } = {};

    //let request object
    const requestOptions: RequestInit = {
      method: config.method,
      headers: config.headers,
      body: config.data,
    };

    const request = new Request(url, requestOptions);

    //fetch the data
    let response: Response;
    try {
      response = await fetch(url, requestOptions);

      response.headers.forEach((value, name) => {
        headers[name] = value;
      });

      //if response is not ok, throw an error
      if (!response.ok) {
        throw new AxiosError(
          response.statusText,
          response.status + "",
          config,
          request,
          {
            data: await response.text(),
            status: response.status,
            statusText: response.statusText,
            headers: headers,
            config,
            request,
          }
        );
      }
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }

    //parse the response
    let data;
    const contentType = headers["content-type"];
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    //create the AxiosResponse object
    const axiosRes: AxiosResponse = {
      data,
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

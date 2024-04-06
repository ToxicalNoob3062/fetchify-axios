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
      throw new AxiosError("No url specified");
    }
    //fetch the data
    let response;
    try {
      response = await fetch(url, {
        method: config.method,
        headers: config.headers,
        body: config.data,
      });
    } catch (err) {
      throw new AxiosError((err as Error).message);
    }

    //convert Headers object to plain object
    const headersObj: { [key: string]: string } = {};
    response.headers.forEach((value, name) => {
      headersObj[name] = value;
    });

    //parse the response
    let data;
    const contentType = headersObj["content-type"];
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
      headers: headersObj,
      config,
      request: {
        url: url,
        method: config.method,
        headers: config.headers,
        body: config.data,
      },
    };

    //return the response
    return axiosRes;
  };
}

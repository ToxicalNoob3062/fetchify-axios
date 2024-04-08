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
    //get the url from the config
    let url = (config.baseURL ? config.baseURL : "") + config.url;
    //append params to the url if they exist
    if (config.params) {
      const params = new URLSearchParams(config.params).toString();
      url += "?" + params;
    }
    if (!url) {
      throw new AxiosError(
        "no url specified. @fetchAdapter",
        "777 (FETCH_ERROR)",
        config
      );
    }

    //to store the headers from Headers object
    let headers: { [key: string]: string } = {};

    //let request object
    const requestOptions: RequestInit = {
      method: config.method,
      headers: config.headers,
      body: config.data,
    };

    //create the request object to refer
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
        const responseObj: AxiosResponse = {
          data: await response.text(),
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
        "an error occurred while making the request.(" +
          err +
          ") @fetchAdapter",
        "777 (FETCH_ERROR)",
        config,
        request
      );
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

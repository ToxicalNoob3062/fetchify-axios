# Fetchify-Axios

This package provides an Axios adapter for any custom fetch function that implements the standard fetch interface for making HTTP requests.

# Motive

This adapter was primarily build to work with http-plugin of tauri v2 via axios but
also capable to handle any type of function that implements fetch interface!

## Installation

```bash
npm install --save fetchify-axios
```

## Usage

```typescript
import createFetchAdapter, { type fetch } from "fetchify-axios";
import axios from "axios";

const myFetch: fetch = async (input, init) => {
  // create your custom fetch function or,
  //use any fetch plugin that implements the fetch interface
};

// Create a new instance of axios with a custom adapter
const instance = axios.create({
  adapter: createFetchAdapter(myFetch),
});

// Use axios instance to make requests
instance.get("/url").then((response) => {
  console.log(response.data);
});
```

In this example, `myFetch` is a custom fetch function. It can be any function that has the same signature as the Fetch API's `fetch` function.

## API

### `createFetchAdapter(fetch)`

Creates a new Axios adapter that uses the given `fetch` function to make HTTP requests.

- `fetch`: A function that has the same signature as the Fetch API's `fetch` function.

Returns an Axios adapter.

## License

MIT

declare module "fetch-parse" {
  type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  type Parser = (res: Response) => Promise<any>;
  type Parsers = { [type: string]: true | Parser };

  function fetchParse(fetch: Fetch, types?: Parsers): Fetch;

  namespace fetchParse {
    function fetch(
      fetch: Fetch,
      types: Parsers,
      url: RequestInfo,
      opts?: RequestInit
    ): Promise<Response>;
    function parse(types: Parsers, res: Response): Promise<Response>;
    function arrayBuffer(res: Response): Promise<ArrayBuffer>;
    function text(res: Response): Promise<string>;
    function json(res: Response): Promise<any>;
    function set(res: Response, body: any): Response;
  }

  export = fetchParse;
}

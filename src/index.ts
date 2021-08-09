import * as cors from "cors";
import { json, text } from "body-parser";
import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import { URL } from "url";
import { routes } from './routes';

const server = express();

const {
  PORT = 3000,
} = process.env;



if (require.main === module) // true if current file is executed and is not imported by another module
{
  server.listen(PORT, () =>
  {
    console.log('Server started at http://localhost:' + PORT);
  });

  // Use body parser fror json and text contents
  server.use(text());
  server.use(json());

  server.all(
    "*",
    // Set cors options here
    cors({ origin: "*", optionsSuccessStatus: 200, methods: "*" }),
    (req: Request, res: Response, next: NextFunction) =>
    {
      let url = new URL(req.url, `http://localhost:${ PORT }`);
      routes.resolve(url.pathname, req.method)(req, res, next);
    }
  );
}
export default server;
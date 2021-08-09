# MVC API Template

## Installation

1. Download the template
2. Install [MongoDB](https://www.mongodb.com/try/download/community)
2. Run `npm install`
3. Run `npm run start`


## Use with VS-Code debugger

1. Enable NPM-Scrips and click on de debug icon on the `start:dev` task

## Build

1. Run `npm build`

## Creating a new route

Navigate into the `src/routes` folder and create a new folder with the name of the route (not case sensitive). Add a new file in the created folder with the name of the method to use the route (not case sensitive).

Following file structure is beeing created for a route `/home` which accepts a `GET` and a `POST` request.

```
- routes [folder]
| - home [folder]
  | - GET.ts [file]
  | - POST.ts [file]
```

Following file structure is beeing created for a route `/path/to/subdirectory` which accepts a `GET` and `DELETE` request.

```
- routes [folder]
| - path [folder]
  | - to [folder]
    | - subdirectory [folder]
      | - GET.ts [file]
      | - DELETE.ts [file]
```

In the previously created file add the following contents:

```typescript
import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) =>
{
    // Handle your request here
};
```

It is important to have the express callback exported as default.

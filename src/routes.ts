import { NextFunction, Request, Response } from 'express';
import { MVC } from './MVC';

export class MVC_Routes extends MVC<(req: Request, res: Response, next: NextFunction) => void>{

    protected fallback: { route: string; method: string; } = {
        route: "/404",
        method: "GET"
    };

    constructor()
    {
        super(require.context("./routes", true, /\.(ts|js|mjs)$/));
        global["routes"] = this;
    }

}

export const routes = new MVC_Routes();

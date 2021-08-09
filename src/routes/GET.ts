import { NextFunction, Request, Response } from 'express';
// Route: /
// Method: GET
export default (req: Request, res: Response, next: NextFunction) =>
{
    res.status(200).json({ data: ["GET"] });
};
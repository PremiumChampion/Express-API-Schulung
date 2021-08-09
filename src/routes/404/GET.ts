import { NextFunction, Request, Response } from 'express';
// Route: /404
// Method: GET
export default (req: Request, res: Response, next: NextFunction) =>
{
    res.status(404).json({error: "The requested ressource was not found on this server."});
};
import { NextFunction, Request, Response } from 'express';
import { MapCustomerDocument } from '../../Customer';
import { Client, ClientSetup } from '../../MongoClient';
// Route: /
// Method: GET
export default async (req: Request, res: Response, next: NextFunction) =>
{
    await ClientSetup.ensureSetup();
    const db = Client.db("Customers");
    const collection = db.collection("Customers");

    const findResult = await collection.find({}).toArray();
    let results = findResult.map(MapCustomerDocument);

    res.json({ data: results });
};
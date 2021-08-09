import { NextFunction, Request, Response } from 'express';
import * as Joi from "joi";
import { ObjectId } from 'mongodb';
import { MapCustomerDocument } from '../../../Customer';
import { Client, ClientSetup } from '../../../MongoClient';
// Route: /
// Method: GET
export default async (req: Request, res: Response, next: NextFunction) =>
{
    const schema = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string(),
        email: Joi.string().email(),
        gender: Joi.string(),
        balance: Joi.number(),
        id: Joi.string(),
    })
        .or("first_name", "last_name", "email", "gender", "gender", "id");

    schema.validateAsync(req.body, { abortEarly: true, })
        .then(async (body: { first_name: string, last_name: string, gender: string, balance: number; id: string; }) =>
        {
            await ClientSetup.ensureSetup();
            const db = Client.db("Customers");
            const collection = db.collection("Customers");

            let filterCustomer: {
                first_name: string;
                last_name: string;
                gender: string;
                balance: number;
                id: string;
            } = { ...body as any };

            if (filterCustomer.id)
            {
                filterCustomer["_id"] = new ObjectId(filterCustomer.id);
            }

            delete filterCustomer.id;

            try
            {
                let filterResults = await collection.find(filterCustomer).toArray();
                let response = (!Array.isArray(filterResults)) ? [filterResults] : filterResults;

                res
                    .status(200)
                    .json({
                        data: response.map(MapCustomerDocument)
                    });

            } catch (error)
            {
                console.error(error);
                res.status(500).json({ error: "Interal server error" });
            }

            res.end();
        })
        .catch((error: Error) =>
        {
            console.log(error);
            res.status(400).json({ error: error.message });
        });
};
import { NextFunction, Request, Response } from 'express';
import * as Joi from "joi";
import { ObjectId } from 'mongodb';
import { Client, ClientSetup } from '../../MongoClient';
// Route: /
// Method: GET
export default async (req: Request, res: Response, next: NextFunction) =>
{
    const schema = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string(),
        email: Joi.string().email(),
        gender: Joi.string(),
        balance: Joi.number().optional().default(0)
    });

    schema.validateAsync(req.body, { abortEarly: true, })
        .then(async (body: { first_name: string, last_name: string, gender: string, balance: number; }) =>
        {
            await ClientSetup.ensureSetup();
            const db = Client.db("Customers");
            const collection = db.collection("Customers");

            try
            {
                let insertionResult = await collection.insertOne({ ...body, });
                res
                    .status(200)
                    .json({
                        data: {
                            ...body,
                            id: insertionResult.insertedId
                        }
                    });
            } catch (error)
            {
                res
                    .status(500)
                    .json({ error: "Interal server error" });
            }

            res.end();
        })
        .catch((error: Error) =>
        {
            res
                .status(400)
                .json({ error: error.message });
        });
};
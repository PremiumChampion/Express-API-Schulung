import { NextFunction, Request, Response } from 'express';
import { isDate, isNil } from 'lodash';
import * as Joi from "joi";
import { Client, ClientSetup } from '../../MongoClient';
import { ObjectId } from 'mongodb';
// Route: /
// Method: GET
export default async (req: Request, res: Response, next: NextFunction) =>
{
    const schema = Joi.object({
        id: Joi.string(),
        ids: Joi.array().items(Joi.string())
    })
        .xor("id", "ids");

    schema.validateAsync(req.body, { abortEarly: true, })
        .then(async (body: { id?: string; ids?: string[]; }) =>
        {
            await ClientSetup.ensureSetup();
            const db = Client.db("Customers");
            const collection = db.collection("Customers");

            if (!isNil(body.id))
            {
                const deletionResult = await collection.deleteOne({ _id: new ObjectId(body.id) });
                res
                    .status(200)
                    .json({ data: deletionResult });
                return;
            }

            if (!isNil(body.ids))
            {
                const deletionResult = await collection.deleteMany({ $or: body.ids.map(id => ({ _id: new ObjectId(id) })) });
                res
                    .status(200)
                    .json({ data: deletionResult });
                return;
            }

            res
                .status(500)
                .json({ error: "Interal server error" });
        })
        .catch((error: Error) =>
        {
            res
                .status(400)
                .json({ error: error.message });
        });

};
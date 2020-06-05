import knex from "../database";
import { Controller } from ".";
import { Request, Response } from 'express';

class ItemsControlller implements Controller {
    async index(req: Request, res: Response) {
        const items = await knex("items").select("*");

        const serialized = items.map((item: Item) => ({
            id: item.id, title: item.title, imageUrl: `${process.env.BASE_URL}:${process.env.PORT}/static/${item.image}`
        }))
        return res.json(serialized);
    }
}

export default ItemsControlller;

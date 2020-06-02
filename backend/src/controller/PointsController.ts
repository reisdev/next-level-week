import knex from "../database";
import { Controller } from ".";
import { Request, Response } from 'express';

class PointsControlller implements Controller {
    async index(req: Request, res: Response) {
        const { uf, city, items } = req.query;

        if (uf && !city) return res.status(400).send({ message: "Missing Paramater 'city'" })
        if (uf && !items) return res.status(400).send({ message: "Missing Paramater 'uf" })
        let points = [];

        if (uf && city && items) {
            const parsedItems = items ? String(items).split(",").map(item => Number(item.trim())) : [];
            points = await knex("points")
                .join("point_items", "points.id", "=", "point_items.point_id")
                .whereIn("point_items.item_id", parsedItems)
                .where("city", String(city))
                .where("uf", String(uf))
                .distinct()
                .select("points.*");
        } else points = await knex("points").select("*");
        return res.json(points);
    }
    async show(req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex("points").where("id", id).first();

        if (!point) return res.status(404).json({ message: "Point not found" })

        const items = await knex("items")
            .join("point_items", "items.id", "=", "point_items.id")
            .where("point_items.point_id", id)
            .select("items.title");
        return res.json(Object.assign(point, { items }));
    }
    async create(req: Request, res: Response) {
        const {
            name,
            image = 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude,
            items
        } = req.body;

        const trx = await knex.transaction();
        const [id] = await trx("points").insert({
            name,
            image,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude
        })

        const pointItems: PointItems[] = items.map((item_id: number) => ({ item_id, point_id: id }))

        await trx("point_items").insert(pointItems);
        await trx.commit();

        return res.status(201).json({
            sucess: true
        });
    }
}

export default PointsControlller;

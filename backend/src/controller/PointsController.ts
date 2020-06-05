import knex from "../database";
import { Controller } from ".";
import { Request, Response } from 'express';
import { QueryBuilder } from "knex";

class PointsControlller implements Controller {
    async index(req: Request, res: Response) {
        const { uf, city, items } = req.query;
        let points = [];
        const parsedItems = items ? String(items).split(",").map(item => Number(item.trim())) : [];
        points = await knex("points")
            .join("point_items", "points.id", "=", "point_items.point_id")
            .modify((qb: QueryBuilder) => {
                if (city)
                    qb.where("city", String(city))
                if (uf)
                    qb.where("uf", String(uf))
                if (parsedItems.length > 0)
                    qb.whereIn("point_items.item_id", parsedItems)
            })
            .distinct()
            .select("points.*");

        const seriazedPoints = points.map(
            (point: Point) =>
                ({
                    ...point, image: point.image.startsWith("http")
                        ? point.image : `${process.env.BASE_URL}:${
                        process.env.PORT}/uploads/${point.image}`
                })
        )

        return res.json(seriazedPoints);
    }
    async show(req: Request, res: Response) {
        const { id } = req.params;
        const point = await knex("points")
            .where("id", id).select("*").first();
        if (!point) return res.status(404)
            .json({ message: "Point not found" })

        const items = await knex("items")
            .join("point_items", "point_items.item_id", "=", "items.id")
            .where("point_items.point_id", "=", id)
            .select("items.title");


        return res.json(Object.assign({
            ...point,
            image: `${process.env.BASE_URL}:${
                process.env.PORT}/uploads/${point.image}`
        }, { items }));
    }
    async create(req: Request, res: Response) {
        const {
            name,
            image,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude,
            items
        } = req.body;

        const point = {
            name,
            image: req.file.filename || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude
        }

        const trx = await knex.transaction();
        const [id] = await trx("points").insert(point)

        const pointItems: PointItems[] = items.split(",")
            .map((item_id: string) =>
                ({ item_id: Number(item_id.trim()), point_id: id })
            )
        await trx("point_items").insert(pointItems);
        await trx.commit();

        return res.status(201).json({
            sucess: true
        });
    }
}

export default PointsControlller;

import express from "express";
import knex from "./database";
import { Item, PointItems } from "..";
import ItemsControlller from "./controller/ItemsController";
import PointsControlller from "./controller/PointsController";

const router = express.Router();

router.get("/", (req, res) => res.json({ message: "Hello World" }));

const pointsController = new PointsControlller()
const itemsController = new ItemsControlller();

router.get("/items", itemsController.index);
router.post("/points", pointsController.create);
router.get("/points", pointsController.index);
router.get("/points/:id", pointsController.show);

export default router;
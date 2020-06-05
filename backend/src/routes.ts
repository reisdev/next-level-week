import express from "express";
import { celebrate, Joi } from "celebrate"

import multer from "multer";
import multerConfig from "../config/multer";

import ItemsControlller from "./controller/ItemsController";
import PointsControlller from "./controller/PointsController";

const router = express.Router();
const upload = multer(multerConfig);

router.get("/", (req, res) => res.json({ message: "Hello World" }));

const pointsController = new PointsControlller()
const itemsController = new ItemsControlller();

router.get("/items", itemsController.index);
router.post("/points",
    upload.single("image"),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().max(2).required(),
            items: Joi.string().regex(/^([0-9],?)+$/).required()
        })
    }, { abortEarly: false }),
    pointsController.create
);
router.get("/points", pointsController.index);
router.get("/points/:id", pointsController.show);

export default router;
import knex from "knex";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
    path: path.resolve(__dirname, "../../.env")
});

export default knex({
    client: process.env.DATABASE_ENGINE,
    useNullAsDefault: true,
    connection: {
        filename: path.resolve(__dirname, "database.sqlite"),
        host: process.env.DATABASE_HOST,
        database: "ecoleta",
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
    }
});



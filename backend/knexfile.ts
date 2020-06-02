import path from "path";

module.exports = {
    client: "sqlite3",
    useNullAsDefault: true,
    connection: {
        filename: path.resolve(__dirname, "src", "database", "database.sqlite")
    },
    migrations: {
        directory: path.resolve(__dirname, "src", "database", "migrations")
    },
    seeds: {
        directory: path.resolve(__dirname, "src", "database", "seeds")
    }
}
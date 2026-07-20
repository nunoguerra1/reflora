import "reflect-metadata";
import { DataSource } from "typeorm";
import { Garden } from "./entities/garden.entity";

const globalForDataSource = globalThis as unknown as {
    dataSource?: DataSource;
};

export const dataSource =
    globalForDataSource.dataSource ??
    new DataSource({
        type: "postgres",
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USER ?? "reflora",
        password: process.env.DB_PASSWORD ?? "reflora",
        database: process.env.DB_NAME ?? "reflora",
        synchronize: process.env.NODE_ENV !== "production",
        entities: [Garden],
    });

if (process.env.NODE_ENV !== "production") {
    globalForDataSource.dataSource = dataSource;
}
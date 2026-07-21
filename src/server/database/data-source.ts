import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, Garden, Plant, CareLog } from "./entities";

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
        entities: [User, Garden, Plant, CareLog],
    });

if (process.env.NODE_ENV !== "production") {
    globalForDataSource.dataSource = dataSource;
}

export async function ensureInitialized() {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }
    return dataSource;
}
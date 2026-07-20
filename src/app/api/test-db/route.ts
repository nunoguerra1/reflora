import { NextResponse } from "next/server";
import { dataSource } from "@/server/database/data-source";
import { Garden } from "@/server/database/entities/garden.entity";

export async function GET() {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }

    const repo = dataSource.getRepository(Garden);
    await repo.save(repo.create({ name: "Horta de teste", latitude: -25.43, longitude: -49.27 }));
    const gardens = await repo.find();

    return NextResponse.json({ gardens });
}
import { NextResponse } from "next/server";
import { createPlantSchema } from "@/server/modules/plants/plants.dto";
import { createPlant, listPlants } from "@/server/modules/plants/plants.service";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const gardenId = searchParams.get("gardenId") ?? undefined;
    const plants = await listPlants(gardenId);
    return NextResponse.json({ plants });
}

export async function POST(request: Request) {
    const body = await request.json();
    const parsed = createPlantSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const plant = await createPlant(parsed.data);
    return NextResponse.json({ plant }, { status: 201 });
}
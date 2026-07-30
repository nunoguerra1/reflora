import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { createGardenSchema } from "@/server/modules/gardens/gardens.dto";
import { createGarden, listGardensByOwner } from "@/server/modules/gardens/gardens.service";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const gardens = await listGardensByOwner(session.user.id);
    return NextResponse.json({ gardens });
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createGardenSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const garden = await createGarden(session.user.id, parsed.data);
    return NextResponse.json({ garden }, { status: 201 });
}
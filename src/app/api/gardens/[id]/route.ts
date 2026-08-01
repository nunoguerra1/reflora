import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { getGardenById } from "@/server/modules/gardens/gardens.service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const garden = await getGardenById(id, session.user.id);

    if (!garden) {
        return NextResponse.json({ error: "Jardim não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ garden });
}
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ensureInitialized } from "@/server/database/data-source";
import { User } from "@/server/database/entities";
import { registerSchema } from "@/server/modules/auth/auth.dto";

export async function POST(request: Request) {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const ds = await ensureInitialized();
    const userRepo = ds.getRepository(User);

    const existing = await userRepo.findOneBy({ email: parsed.data.email });
    if (existing) {
        return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await userRepo.save(
        userRepo.create({
            name: parsed.data.name,
            email: parsed.data.email,
            passwordHash,
        })
    );

    return NextResponse.json(
        { user: { id: user.id, name: user.name, email: user.email } },
        { status: 201 }
    );
}
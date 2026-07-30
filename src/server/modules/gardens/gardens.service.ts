import { getGardensRepository } from "./gardens.repository";
import type { CreateGardenInput } from "./gardens.dto";

export async function listGardensByOwner(ownerId: string) {
    const repo = await getGardensRepository();
    return repo.find({
        where: { owner: { id: ownerId } },
        relations: { plants: true },
        order: { createdAt: "DESC" },
    });
}

export async function createGarden(ownerId: string, input: CreateGardenInput) {
    const repo = await getGardensRepository();
    const garden = repo.create({
        name: input.name,
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
        owner: { id: ownerId },
    });
    return repo.save(garden);
}
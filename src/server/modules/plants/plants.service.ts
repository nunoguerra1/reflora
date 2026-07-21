import { getPlantsRepository } from "./plants.repository";
import type { CreatePlantInput } from "./plants.dto";

export async function listPlants(gardenId?: string) {
    const repo = await getPlantsRepository();
    return repo.find({
        where: gardenId ? { garden: { id: gardenId } } : {},
        relations: { garden: true },
        order: { createdAt: "DESC" },
    });
}

export async function createPlant(input: CreatePlantInput) {
    const repo = await getPlantsRepository();
    const plant = repo.create({
        species: input.species,
        plantedAt: input.plantedAt ?? new Date(),
        garden: { id: input.gardenId },
    });
    return repo.save(plant);
}
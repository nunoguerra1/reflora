import { z } from "zod";

export const createPlantSchema = z.object({
    species: z.string().min(1).max(120),
    gardenId: z.string().uuid(),
    plantedAt: z.coerce.date().optional(),
});

export type CreatePlantInput = z.infer<typeof createPlantSchema>;
import { z } from "zod";

export const createGardenSchema = z.object({
    name: z.string().min(1).max(120),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export type CreateGardenInput = z.infer<typeof createGardenSchema>;
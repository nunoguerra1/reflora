import { ensureInitialized } from "@/server/database/data-source";
import { Plant } from "@/server/database/entities";

export async function getPlantsRepository() {
    const ds = await ensureInitialized();
    return ds.getRepository(Plant);
}
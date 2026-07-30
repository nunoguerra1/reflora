import { ensureInitialized } from "@/server/database/data-source";
import { Garden } from "@/server/database/entities";

export async function getGardensRepository() {
    const ds = await ensureInitialized();
    return ds.getRepository(Garden);
}
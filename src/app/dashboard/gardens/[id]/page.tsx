import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { CreatePlantForm } from "../../../../components/dashboard/create-garden-form";

type Plant = {
    id: string;
    species: string;
    plantedAt: string;
};

type Garden = {
    id: string;
    name: string;
};

async function getBaseUrl() {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
}

async function fetchGarden(id: string): Promise<Garden | null> {
    const cookieStore = await cookies();
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/gardens/${id}`, {
        headers: { cookie: cookieStore.toString() },
        cache: "no-store",
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.garden;
}

async function fetchPlants(gardenId: string): Promise<Plant[]> {
    const cookieStore = await cookies();
    const baseUrl = await getBaseUrl();
    const response = await fetch(`${baseUrl}/api/plants?gardenId=${gardenId}`, {
        headers: { cookie: cookieStore.toString() },
        cache: "no-store",
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.plants ?? [];
}

export default async function GardenDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const garden = await fetchGarden(id);

    if (!garden) notFound();

    const plants = await fetchPlants(id);

    return (
        <div>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
                ← Meus jardins
            </Link>

            <h1 className="mt-4 font-display text-3xl font-bold text-foreground">{garden.name}</h1>
            <p className="mt-2 text-muted-foreground">
                {plants.length === 0
                    ? "Nenhuma planta registrada ainda."
                    : `${plants.length} planta${plants.length > 1 ? "s" : ""}.`}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plants.map((plant) => (
                    <div key={plant.id} className="rounded-2xl border border-border bg-secondary/20 p-6">
                        <h3 className="font-display text-lg font-bold text-foreground">{plant.species}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Plantada em {new Date(plant.plantedAt).toLocaleDateString("pt-BR")}
                        </p>
                    </div>
                ))}
                <CreatePlantForm gardenId={garden.id} />
            </div>
        </div>
    );
}
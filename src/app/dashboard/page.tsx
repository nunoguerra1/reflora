import { cookies, headers } from "next/headers";
import { CreateGardenForm } from "@/components/dashboard/create-garden-form";

type GardenSummary = {
    id: string;
    name: string;
    plants?: unknown[];
};

async function fetchGardens(): Promise<GardenSummary[]> {
    const cookieStore = await cookies();
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";

    const response = await fetch(`${protocol}://${host}/api/gardens`, {
        headers: { cookie: cookieStore.toString() },
        cache: "no-store",
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.gardens ?? [];
}

export default async function DashboardPage() {
    const gardens = await fetchGardens();

    return (
        <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Meus jardins</h1>
            <p className="mt-2 text-muted-foreground">
                {gardens.length === 0
                    ? "Você ainda não tem nenhum jardim. Que tal criar o primeiro?"
                    : `${gardens.length} jardim${gardens.length > 1 ? "ns" : ""} registrado${gardens.length > 1 ? "s" : ""
                    }.`}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gardens.map((garden) => (
                    <div
                        key={garden.id}
                        className="rounded-2xl border border-border bg-secondary/20 p-6 transition-colors hover:border-primary/50"
                    >
                        <h3 className="font-display text-lg font-bold text-foreground">{garden.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {garden.plants?.length ?? 0} planta{garden.plants?.length === 1 ? "" : "s"}
                        </p>
                    </div>
                ))}
                <CreateGardenForm />
            </div>
        </div>
    );
}
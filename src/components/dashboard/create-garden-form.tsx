"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export function CreatePlantForm({ gardenId }: { gardenId: string }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [species, setSpecies] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const response = await fetch("/api/plants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ species, gardenId }),
        });

        setLoading(false);

        if (!response.ok) {
            setError("Não foi possível adicionar a planta.");
            return;
        }

        setSpecies("");
        setOpen(false);
        router.refresh();
    }

    if (!open) {
        return (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpen(true)}
                className="flex h-full min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
            >
                <span className="text-2xl">+</span>
                <span className="text-sm">Nova planta</span>
            </motion.button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-secondary/30 p-6"
        >
            <input
                autoFocus
                required
                value={species}
                onChange={(event) => setSpecies(event.target.value)}
                placeholder="Espécie (ex: Samambaia)"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                    {loading ? "Adicionando..." : "Adicionar"}
                </button>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}
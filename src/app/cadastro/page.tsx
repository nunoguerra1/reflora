"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function CadastroPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const data = await response.json().catch(() => null);
            setError(data?.error ?? "Não foi possível criar a conta.");
            setLoading(false);
            return;
        }

        const result = await signIn("credentials", { email, password, redirect: false });
        setLoading(false);

        if (!result || result.error) {
            router.push("/entrar");
            return;
        }

        router.push("/");
        router.refresh();
    }

    return (
        <AuthLayout>
            <h1 className="font-display text-3xl font-bold text-foreground">Criar conta</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Comece a registrar suas plantas hoje.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
                <div>
                    <label
                        htmlFor="name"
                        className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                        Nome
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-border bg-secondary/30 px-4 py-3 text-foreground outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                        E-mail
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-border bg-secondary/30 px-4 py-3 text-foreground outline-none focus:border-primary"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground"
                    >
                        Senha
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-border bg-secondary/30 px-4 py-3 text-foreground outline-none focus:border-primary"
                    />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity disabled:opacity-60"
                >
                    {loading ? "Criando conta..." : "Criar conta"}
                </button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
                Já tem conta?{" "}
                <Link href="/entrar" className="text-accent underline-offset-4 hover:underline">
                    Entrar
                </Link>
            </p>
        </AuthLayout>
    );
}
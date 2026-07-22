"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function EntrarPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (!result || result.error) {
            setError("E-mail ou senha incorretos.");
            return;
        }

        router.push("/");
        router.refresh();
    }

    return (
        <AuthLayout>
            <h1 className="font-display text-3xl font-bold text-foreground">Entrar</h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Acompanhe suas plantas e o impacto da comunidade.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
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
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
                Não tem conta?{" "}
                <Link href="/cadastro" className="text-accent underline-offset-4 hover:underline">
                    Cadastre-se
                </Link>
            </p>
        </AuthLayout>
    );
}
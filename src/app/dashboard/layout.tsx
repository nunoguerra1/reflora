import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/server/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/entrar");
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
                    <Link href="/" className="font-display text-lg font-bold text-foreground">
                        reflora
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{session?.user?.name}</span>
                        <form
                            action={async () => {
                                "use server";
                                await signOut({ redirectTo: "/" });
                            }}
                        >
                            <button className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground">
                                Sair
                            </button>
                        </form>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
        </div>
    );
}
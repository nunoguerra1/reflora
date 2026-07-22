"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
    { label: "Comunidade", href: "#comunidade" },
    { label: "Mapa", href: "#mapa" },
    { label: "Sobre", href: "#sobre" },
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();
    const { data: session, status } = useSession();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 40);
    });

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${scrolled
                    ? "border-border bg-background/80 backdrop-blur-lg"
                    : "border-transparent bg-transparent"
                }`}
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <Link href="/" className="font-display text-xl font-bold text-foreground">
                    reflora
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {status === "authenticated" ? (
                    <div className="flex items-center gap-3">
                        <span className="hidden font-sans text-sm text-muted-foreground sm:inline">
                            {session?.user?.name}
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => signOut()}
                            className="rounded-full border border-border px-5 py-2 font-sans text-sm font-medium text-foreground"
                        >
                            Sair
                        </motion.button>
                    </div>
                ) : (
                    <Link href="/entrar">
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-block rounded-full bg-primary px-5 py-2 font-sans text-sm font-medium text-primary-foreground"
                        >
                            Entrar
                        </motion.span>
                    </Link>
                )}
            </div>
        </motion.header>
    );
}
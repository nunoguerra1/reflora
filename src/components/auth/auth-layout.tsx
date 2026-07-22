"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { GrainOverlay } from "@/components/motion/grain-overlay";
import { LeafMark } from "@/components/motion/leaf-mark";

export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
            <div className="flex items-center justify-center px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-sm"
                >
                    <Link
                        href="/"
                        className="mb-10 inline-block font-display text-xl font-bold text-foreground"
                    >
                        reflora
                    </Link>
                    {children}
                </motion.div>
            </div>

            <div className="relative hidden overflow-hidden bg-secondary/20 md:block">
                <GrainOverlay opacity={0.04} />
                <div className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-primary/15 blur-[120px]" />
                <div className="pointer-events-none absolute -right-10 bottom-1/4 h-72 w-72 rounded-full bg-accent/10 blur-[110px]" />
                <div className="relative flex h-full flex-col items-start justify-end p-16">
                    <LeafMark className="mb-6 h-8 w-8 text-accent" />
                    <p className="max-w-sm font-display text-3xl font-semibold leading-tight text-foreground">
                        Cada planta tem uma história. A sua começa aqui.
                    </p>
                </div>
            </div>
        </div>
    );
}
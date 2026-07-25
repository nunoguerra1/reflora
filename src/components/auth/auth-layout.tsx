"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { GrainOverlay } from "@/components/motion/grain-overlay";

function DrawnLeafMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <motion.path
                d="M4 20c0-9 6-15 15-16-1 9-7 15-16 16Z"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
            />
            <motion.path
                d="M5 19c3-3 6-6 13-14"
                stroke="currentColor"
                strokeWidth={1.2}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: [0.65, 0, 0.35, 1], delay: 1.2 }}
            />
        </svg>
    );
}

export const fieldVariants = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
};

export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
            <div className="flex items-center justify-center px-6 py-24">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                    className="w-full max-w-sm"
                >
                    <motion.div
                        variants={fieldVariants}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Link
                            href="/"
                            className="mb-10 inline-block font-display text-xl font-bold text-foreground"
                        >
                            reflora
                        </Link>
                    </motion.div>
                    {children}
                </motion.div>
            </div>

            <div className="relative hidden overflow-hidden bg-secondary/20 md:block">
                <GrainOverlay opacity={0.04} />
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-primary blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="pointer-events-none absolute -right-10 bottom-1/4 h-72 w-72 rounded-full bg-accent blur-[110px]"
                />
                <div className="relative flex h-full flex-col items-start justify-end p-16">
                    <DrawnLeafMark className="mb-6 h-8 w-8 text-accent" />
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                        className="max-w-sm font-display text-3xl font-semibold leading-tight text-foreground"
                    >
                        Cada planta tem uma história. A sua começa aqui.
                    </motion.p>
                </div>
            </div>
        </div>
    );
}
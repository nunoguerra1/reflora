"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useTransform } from "motion/react";
import { GrainOverlay } from "@/components/motion/grain-overlay";
import { LeafMark } from "@/components/motion/leaf-mark";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
    {
        title: "Diário de crescimento",
        description:
            "Fotos e notas ao longo do tempo, organizadas numa timeline visual de cada planta.",
    },
    {
        title: "Lembretes automáticos",
        description:
            "Rega, adubação e poda chegam na hora certa — sem depender da sua memória.",
    },
    {
        title: "Mapa da comunidade",
        description:
            "Descubra jardins e árvores plantadas perto de você, e troque mudas com vizinhos.",
    },
    {
        title: "Impacto coletivo",
        description:
            "Acompanhe, em tempo real, quantas árvores a comunidade já registrou — e o CO₂ estimado que elas absorvem.",
    },
];

function FeatureCard({
    index,
    title,
    description,
}: {
    index: number;
    title: string;
    description: ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);

    function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformPerspective: 800 }}
            className="feature-card rounded-2xl border border-border bg-secondary/30 p-8"
        >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                {title}
            </h3>
            <p className="mt-3 text-muted-foreground">{description}</p>
        </motion.div>
    );
}

export function Features() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from(".feature-card", {
                opacity: 0,
                y: 40,
                duration: 0.8,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            gsap.from(".features-eyebrow, .features-heading", {
                opacity: 0,
                y: 24,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
            });
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-background px-6 py-32"
        >
            <GrainOverlay opacity={0.03} />
            <div className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />

            <div className="relative z-10 mx-auto max-w-6xl">
                <div className="features-eyebrow mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                    <LeafMark className="h-4 w-4" />
                    <span>02 — Como funciona</span>
                </div>

                <h2 className="features-heading max-w-2xl font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                    Tudo que sua planta precisa, num só lugar.
                </h2>

                <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {FEATURES.map((feature, i) => (
                        <FeatureCard key={feature.title} index={i} {...feature} />
                    ))}
                </div>
            </div>
        </section>
    );
}
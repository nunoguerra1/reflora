"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GrainOverlay } from "@/components/motion/grain-overlay";
import { LeafMark } from "@/components/motion/leaf-mark";

gsap.registerPlugin(ScrollTrigger);

const CommunityMap = dynamic(
    () => import("@/components/map/community-map").then((m) => m.CommunityMap),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full w-full items-center justify-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
            </div>
        ),
    }
);

const STATS = [
    { id: "arvores", target: 1240, suffix: "", label: "árvores registradas" },
    { id: "jardins", target: 86, suffix: "", label: "jardins comunitários" },
    { id: "co2", target: 4.8, suffix: " ton", label: "de CO₂ estimado absorvido" },
];

export function MapTeaser() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const statRefs = useRef<Array<HTMLSpanElement | null>>([]);

    useGSAP(
        () => {
            gsap.from(".map-eyebrow, .map-heading, .map-desc, .map-frame", {
                opacity: 0,
                y: 24,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%",
                },
            });

            STATS.forEach((stat, i) => {
                const el = statRefs.current[i];
                if (!el) return;
                const counter = { value: 0 };
                gsap.to(counter, {
                    value: stat.target,
                    duration: 1.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    },
                    onUpdate: () => {
                        const formatted =
                            stat.target % 1 === 0
                                ? Math.round(counter.value).toLocaleString("pt-BR")
                                : counter.value.toFixed(1).replace(".", ",");
                        el.textContent = `${formatted}${stat.suffix}`;
                    },
                });
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
            <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />

            <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
                <div>
                    <div className="map-eyebrow mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                        <LeafMark className="h-4 w-4" />
                        <span>03 — Comunidade</span>
                    </div>

                    <h2 className="map-heading font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
                        Você não está plantando sozinho.
                    </h2>

                    <p className="map-desc mt-6 max-w-md text-lg text-muted-foreground">
                        Descubra jardins e árvores plantadas perto de você, e acompanhe o
                        impacto crescendo em tempo real.
                    </p>

                    <div className="mt-10 grid grid-cols-3 gap-6">
                        {STATS.map((stat, i) => (
                            <div key={stat.id}>
                                <span
                                    ref={(el) => {
                                        statRefs.current[i] = el;
                                    }}
                                    className="font-display text-2xl font-bold text-foreground md:text-3xl"
                                >
                                    0
                                </span>
                                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="map-frame relative aspect-square w-full overflow-hidden rounded-[2rem] border border-border">
                    <CommunityMap />
                </div>
            </div>
        </section>
    );
}
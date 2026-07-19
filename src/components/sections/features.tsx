"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GrainOverlay } from "@/components/motion/grain-overlay";
import { LeafMark } from "@/components/motion/leaf-mark";
import { FEATURE_CARDS, getRevealProgress } from "@/lib/feature-cards";

gsap.registerPlugin(ScrollTrigger);

const CANOPY_IMAGE_URL =
    "https://images.unsplash.com/photo-1764208637252-4cb59a64a674?q=80&w=2400&auto=format&fit=crop";

export function Features() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const pinnedRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

    useGSAP(
        () => {
            const trigger = {
                trigger: wrapperRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            };

            gsap.fromTo(
                imageRef.current,
                { scale: 1 },
                { scale: 1.15, ease: "none", scrollTrigger: trigger }
            );

            ScrollTrigger.create({
                ...trigger,
                pin: pinnedRef.current,
                onUpdate: (self) => {
                    FEATURE_CARDS.forEach((_, i) => {
                        const el = cardRefs.current[i];
                        if (!el) return;
                        const t = getRevealProgress(self.progress, i, FEATURE_CARDS.length);
                        el.style.opacity = String(t);
                        el.style.transform = `translateY(${(1 - t) * 24}px) scale(${0.92 + t * 0.08})`;
                    });
                },
            });
        },
        { scope: wrapperRef }
    );

    return (
        <div
            ref={wrapperRef}
            style={{ height: `${FEATURE_CARDS.length * 90}vh` }}
            className="relative"
        >
            <div
                ref={pinnedRef}
                className="relative flex h-screen items-center overflow-hidden bg-background"
            >
                <div ref={imageRef} className="absolute inset-0">
                    <Image
                        src={CANOPY_IMAGE_URL}
                        alt="Copa de árvore vista de baixo, luz filtrando pelas folhas"
                        fill
                        priority={false}
                        className="object-cover brightness-[0.45] saturate-[0.85]"
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />
                <GrainOverlay opacity={0.05} />

                <div className="pointer-events-none absolute left-6 top-10 z-10 md:left-10">
                    <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                        <LeafMark className="h-4 w-4" />
                        <span>02 — Como funciona</span>
                    </div>
                    <h2 className="max-w-sm font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
                        Tudo que sua planta precisa, num só lugar.
                    </h2>
                </div>

                {FEATURE_CARDS.map((card, i) => {
                    const style: CSSProperties = {
                        ...card.position,
                        opacity: i === 0 ? 1 : 0,
                    };
                    return (
                        <div
                            key={card.id}
                            ref={(el) => {
                                cardRefs.current[i] = el;
                            }}
                            style={style}
                            className="absolute z-10 w-56 rounded-xl border border-border bg-background/80 p-4 backdrop-blur-md transition-transform"
                        >
                            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <h3 className="mt-1 font-display text-sm font-bold text-foreground">
                                {card.title}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
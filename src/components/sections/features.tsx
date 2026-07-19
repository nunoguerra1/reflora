"use client";

import { useRef, type MouseEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useMotionTemplate, useTransform } from "motion/react";
import { GrainOverlay } from "@/components/motion/grain-overlay";
import { LeafMark } from "@/components/motion/leaf-mark";
import { FEATURE_CARDS, type FeatureCard as FeatureCardData } from "@/lib/feature-cards";

gsap.registerPlugin(ScrollTrigger);

function remap(t: number, start: number, end: number) {
    return Math.min(1, Math.max(0, (t - start) / (end - start)));
}

function backOut(t: number, overshoot = 1.7) {
    const c = overshoot;
    return 1 + c * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

type CardRefs = {
    root: HTMLDivElement | null;
    panel: HTMLDivElement | null;
    number: HTMLSpanElement | null;
    title: HTMLHeadingElement | null;
    desc: HTMLParagraphElement | null;
};

function FeatureCardVisual({
    card,
    index,
    registerRefs,
}: {
    card: FeatureCardData;
    index: number;
    registerRefs: (refs: Partial<CardRefs>) => void;
}) {
    const tiltRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useMotionValue(50);
    const mouseY = useMotionValue(50);
    const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
    const sheen = useMotionTemplate`radial-gradient(200px circle at ${mouseX}% ${mouseY}%, rgba(139,175,82,0.28), transparent 70%)`;

    function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
        const rect = tiltRef.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        x.set(px - 0.5);
        y.set(py - 0.5);
        mouseX.set(px * 100);
        mouseY.set(py * 100);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <div
            ref={(el) => registerRefs({ root: el })}
            className="w-[300px] shrink-0 md:w-[360px]"
        >
            <motion.div
                ref={tiltRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformPerspective: 700 }}
                className="group relative overflow-hidden rounded-2xl border border-border"
            >
                <div
                    ref={(el) => registerRefs({ panel: el })}
                    className="absolute inset-0 bg-secondary/40 backdrop-blur-md"
                />
                <motion.div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: sheen }}
                />
                <div className="relative z-10 p-7">
                    <span
                        ref={(el) => registerRefs({ number: el })}
                        className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent"
                    >
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3
                        ref={(el) => registerRefs({ title: el })}
                        className="mt-4 whitespace-nowrap font-display text-2xl font-bold text-foreground"
                    >
                        {card.title}
                    </h3>
                    <p
                        ref={(el) => registerRefs({ desc: el })}
                        className="mt-3 text-sm text-muted-foreground"
                    >
                        {card.description}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export function Features() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const pinnedRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<CardRefs[]>(
        FEATURE_CARDS.map(() => ({ root: null, panel: null, number: null, title: null, desc: null }))
    );

    useGSAP(
        () => {
            const track = trackRef.current;
            if (!track) return;

            const distance = track.scrollWidth - window.innerWidth + 160;

            gsap.to(track, {
                x: -distance,
                ease: "none",
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    pin: pinnedRef.current,
                    scrub: 1,
                    onUpdate: (self) => {
                        if (progressBarRef.current) {
                            progressBarRef.current.style.width = `${self.progress * 100}%`;
                        }

                        const viewportCenter = window.innerWidth / 2;

                        cardRefs.current.forEach((refs) => {
                            if (!refs.root) return;
                            const rect = refs.root.getBoundingClientRect();
                            const cardCenter = rect.left + rect.width / 2;
                            const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
                            const focus = Math.max(0, 1 - distanceFromCenter / (window.innerWidth * 0.55));

                            refs.root.style.transform = `scale(${0.8 + focus * 0.2})`;
                            refs.root.style.filter = `blur(${(1 - focus) * 4}px)`;
                            refs.root.style.opacity = String(0.35 + focus * 0.65);

                            const panelT = remap(focus, 0, 0.6);
                            const numberT = remap(focus, 0.15, 0.75);
                            const titleT = remap(focus, 0.3, 0.9);
                            const descT = remap(focus, 0.5, 1);

                            if (refs.panel) refs.panel.style.clipPath = `inset(0 ${(1 - panelT) * 100}% 0 0)`;
                            if (refs.number) {
                                refs.number.style.opacity = numberT > 0.02 ? "1" : "0";
                                refs.number.style.transform = `scale(${Math.max(0, backOut(numberT))})`;
                            }
                            if (refs.title) refs.title.style.clipPath = `inset(0 ${(1 - titleT) * 100}% 0 0)`;
                            if (refs.desc) refs.desc.style.opacity = String(descT);
                        });
                    },
                },
            });
        },
        { scope: wrapperRef }
    );

    return (
        <div ref={wrapperRef} style={{ height: `${FEATURE_CARDS.length * 70}vh` }} className="relative">
            <div ref={pinnedRef} className="relative h-screen overflow-hidden bg-background">
                <GrainOverlay opacity={0.04} />
                <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />
                <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />

                <div className="absolute left-6 top-28 z-10 md:left-10 md:top-32">
                    <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                        <LeafMark className="h-4 w-4" />
                        <span>02 — Como funciona</span>
                    </div>
                    <h2 className="max-w-sm font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
                        Tudo que sua planta precisa, num só lugar.
                    </h2>
                </div>

                <div className="flex h-full items-center">
                    <div ref={trackRef} className="flex gap-8 px-6 md:pl-[42vw] md:pr-24">
                        {FEATURE_CARDS.map((card, i) => (
                            <FeatureCardVisual
                                key={card.id}
                                card={card}
                                index={i}
                                registerRefs={(refs) => {
                                    cardRefs.current[i] = { ...cardRefs.current[i], ...refs };
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="absolute inset-x-6 bottom-10 z-10 h-px bg-border md:inset-x-10">
                    <div ref={progressBarRef} className="h-full w-0 bg-primary" />
                </div>
            </div>
        </div>
    );
}
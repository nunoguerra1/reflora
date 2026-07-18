"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { GrainOverlay } from "@/components/motion/grain-overlay";
import { LeafMark } from "@/components/motion/leaf-mark";

gsap.registerPlugin(SplitText, ScrollTrigger);

const BonsaiScene = dynamic(
    () => import("@/components/three/real-bonsai-scene").then((m) => m.RealBonsaiScene),
    {
        ssr: false,
        loading: () => (
            <div className="flex h-full w-full items-center justify-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
            </div>
        ),
    }
);

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollProgressRef = useRef(0);

    useGSAP(
        () => {
            SplitText.create(".hero-headline", {
                type: "words",
                mask: "words",
                autoSplit: true,
                onSplit: (self) => {
                    return gsap.from(self.words, {
                        y: "100%",
                        opacity: 0,
                        duration: 0.9,
                        stagger: 0.06,
                        ease: "power3.out",
                        delay: 0.5,
                    });
                },
            });

            gsap.from(".hero-eyebrow", {
                opacity: 0,
                y: -10,
                duration: 0.7,
                ease: "power2.out",
                delay: 0.2,
            });

            gsap.from(".hero-sub, .hero-cta", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                delay: 1.1,
            });

            gsap.from(".hero-visual-frame", {
                opacity: 0,
                scale: 0.94,
                duration: 1.1,
                ease: "power3.out",
                delay: 0.3,
            });

            gsap.from(".hero-numeral", {
                opacity: 0,
                duration: 1.4,
                ease: "power1.out",
                delay: 0.4,
            });

            gsap.to(".hero-visual-frame", {
                y: -60,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                    onUpdate: (self) => {
                        scrollProgressRef.current = self.progress;
                    },
                },
            });

            gsap.to(".hero-text-col", {
                y: -30,
                opacity: 0.25,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                },
            });
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen overflow-hidden bg-background"
        >
            <GrainOverlay />

            <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-accent/10 blur-[110px]" />

            <span className="hero-numeral pointer-events-none absolute -top-6 left-4 select-none font-display text-[9rem] font-bold leading-none text-foreground/[0.04] md:left-10 md:text-[13rem]">
                01
            </span>

            <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-32 md:grid-cols-2 md:gap-12 md:pb-0 md:pt-24">
                <div className="hero-text-col">
                    <div className="hero-eyebrow mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                        <LeafMark className="h-4 w-4" />
                        <span>Reflora — reflorestamento urbano</span>
                    </div>

                    <h1 className="hero-headline font-display text-5xl font-bold leading-[1.05] text-foreground md:text-6xl lg:text-7xl">
                        Cada planta tem uma história. A sua começa aqui.
                    </h1>

                    <p className="hero-sub mt-6 max-w-md text-lg text-muted-foreground">
                        Registre, acompanhe e celebre o crescimento de árvores e jardins
                        reais — e veja o impacto crescer junto com a comunidade.
                    </p>

                    <div className="hero-cta mt-10">
                        <MagneticButton>Começar a plantar</MagneticButton>
                    </div>
                </div>

                <div className="hero-visual-frame relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-border md:aspect-auto md:h-[32rem]">
                    <BonsaiScene scrollProgressRef={scrollProgressRef} />
                    <span className="pointer-events-none absolute bottom-5 right-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        bonsai · reflora
                    </span>
                </div>
            </div>
        </section>
    );
}
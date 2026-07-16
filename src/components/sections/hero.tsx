"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { MagneticButton } from "@/components/motion/magnetic-button";

gsap.registerPlugin(SplitText);

const SeedlingScene = dynamic(
    () => import("@/components/three/seedling-scene").then((m) => m.SeedlingScene),
    { ssr: false }
);

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

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
                        delay: 0.3,
                    });
                },
            });

            gsap.from(".hero-sub, .hero-cta", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                delay: 1,
            });
        },
        { scope: containerRef }
    );

    return (
        <section
            ref={containerRef}
            className="relative flex min-h-screen items-center overflow-hidden bg-background"
        >
            <div className="absolute inset-0">
                <SeedlingScene />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                <h1 className="hero-headline font-display text-5xl font-bold leading-tight text-foreground md:text-7xl">
                    Cada planta tem uma história. A sua começa aqui.
                </h1>
                <p className="hero-sub mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                    Registre, acompanhe e celebre o crescimento de árvores e jardins
                    reais — e veja o impacto crescer junto com a comunidade.
                </p>
                <div className="hero-cta mt-10 flex justify-center">
                    <MagneticButton>Começar a plantar</MagneticButton>
                </div>
            </div>
        </section>
    );
}
"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CAMERA_BEATS, getBeatOpacity } from "@/lib/story-beats";
import { GrainOverlay } from "@/components/motion/grain-overlay";

gsap.registerPlugin(ScrollTrigger);

const StoryScene = dynamic(
    () => import("@/components/three/story-scene").then((m) => m.StoryScene),
    { ssr: false }
);

export function PlantStory() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const pinnedRef = useRef<HTMLDivElement>(null);
    const scrollProgressRef = useRef(0);
    const captionRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [activeBeat, setActiveBeat] = useState(0);

    useGSAP(
        () => {
            ScrollTrigger.create({
                trigger: wrapperRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: pinnedRef.current,
                scrub: 1,
                onUpdate: (self) => {
                    scrollProgressRef.current = self.progress;

                    CAMERA_BEATS.forEach((_, i) => {
                        const el = captionRefs.current[i];
                        if (el) {
                            el.style.opacity = String(getBeatOpacity(self.progress, i, CAMERA_BEATS.length));
                        }
                    });

                    const idx = Math.min(
                        Math.floor(self.progress * CAMERA_BEATS.length),
                        CAMERA_BEATS.length - 1
                    );
                    setActiveBeat((prev) => (prev === idx ? prev : idx));
                },
            });
        },
        { scope: wrapperRef }
    );

    return (
        <div
            ref={wrapperRef}
            style={{ height: `${CAMERA_BEATS.length * 100}vh` }}
            className="relative"
        >
            <div
                ref={pinnedRef}
                className="relative flex h-screen items-center overflow-hidden bg-background"
            >
                <GrainOverlay opacity={0.03} />

                <span className="pointer-events-none absolute left-6 top-10 select-none font-display text-6xl font-bold text-foreground/[0.05] md:left-10 md:text-8xl">
                    03
                </span>

                <div className="absolute inset-0">
                    <StoryScene scrollProgressRef={scrollProgressRef} />
                </div>

                <div className="relative z-10 mx-auto w-full max-w-xl px-6">
                    {CAMERA_BEATS.map((beat, i) => (
                        <div
                            key={beat.label}
                            ref={(el) => {
                                captionRefs.current[i] = el;
                            }}
                            className="absolute inset-x-6 bottom-16 text-left md:bottom-24"
                            style={{ opacity: i === 0 ? 1 : 0 }}
                        >
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                                {String(i + 1).padStart(2, "0")} — {beat.label}
                            </span>
                            <p className="mt-3 max-w-md font-display text-2xl font-semibold text-foreground md:text-3xl">
                                {beat.text}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-3 md:right-10">
                    {CAMERA_BEATS.map((_, i) => (
                        <span
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${i === activeBeat ? "scale-125 bg-primary" : "bg-border"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STAGE_CONTENT, getStageOpacity } from "@/lib/growth-stages";

gsap.registerPlugin(ScrollTrigger);

const GrowthScene = dynamic(
    () => import("@/components/three/growth-scene").then((m) => m.GrowthScene),
    { ssr: false }
);

export function ScrollStory() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const pinnedRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const captionRefs = useRef<Array<HTMLDivElement | null>>([]);

    useGSAP(
        () => {
            ScrollTrigger.create({
                trigger: wrapperRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: pinnedRef.current,
                scrub: 1,
                onUpdate: (self) => {
                    progressRef.current = self.progress;
                    STAGE_CONTENT.forEach((_, i) => {
                        const el = captionRefs.current[i];
                        if (el) el.style.opacity = String(getStageOpacity(self.progress, i));
                    });
                },
            });
        },
        { scope: wrapperRef }
    );

    return (
        <div
            ref={wrapperRef}
            style={{ height: `${STAGE_CONTENT.length * 100}vh` }}
            className="relative"
        >
            <div
                ref={pinnedRef}
                className="relative flex h-screen items-center overflow-hidden bg-background"
            >
                <div className="absolute inset-0">
                    <GrowthScene progressRef={progressRef} />
                </div>

                <div className="relative z-10 mx-auto w-full max-w-2xl px-6">
                    {STAGE_CONTENT.map((stage, i) => (
                        <div
                            key={stage.key}
                            ref={(el) => {
                                captionRefs.current[i] = el;
                            }}
                            className="absolute inset-x-6 top-1/2 -translate-y-1/2 text-center"
                            style={{ opacity: i === 0 ? 1 : 0 }}
                        >
                            <span className="font-mono text-sm uppercase tracking-widest text-accent">
                                {String(i + 1).padStart(2, "0")} — {stage.label}
                            </span>
                            <p className="mt-4 font-display text-3xl font-semibold text-foreground md:text-4xl">
                                {stage.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
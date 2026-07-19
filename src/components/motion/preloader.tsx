"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { LeafMark } from "./leaf-mark";

const SESSION_KEY = "reflora-preloader-shown";

export function Preloader() {
    const [visible, setVisible] = useState(() => {
        if (typeof window === "undefined") return true;
        return !sessionStorage.getItem(SESSION_KEY);
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const topPanelRef = useRef<HTMLDivElement>(null);
    const bottomPanelRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!visible) return;

            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            document.body.style.overflow = "hidden";
            sessionStorage.setItem(SESSION_KEY, "1");

            const finish = () => {
                document.body.style.overflow = "hidden";
                setVisible(false);
            };

            if (prefersReducedMotion) {
                finish();
                return;
            }

            const counter = { value: 0 };
            const tl = gsap.timeline({ onComplete: finish });

            tl.to(counter, {
                value: 100,
                duration: 1.6,
                ease: "power2.inOut",
                onUpdate: () => {
                    if (counterRef.current) {
                        counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
                    }
                    if (barRef.current) {
                        barRef.current.style.width = `${counter.value}%`;
                    }
                },
            })
                .to(topPanelRef.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, "+=0.15")
                .to(bottomPanelRef.current, { yPercent: 100, duration: 0.7, ease: "power4.inOut" }, "<");
        },
        { scope: containerRef, dependencies: [visible] }
    );

    if (!visible) return null;

    return (
        <div ref={containerRef} className="fixed inset-0 z-[100]">
            <div ref={topPanelRef} className="absolute inset-x-0 top-0 h-1/2 bg-background" />
            <div ref={bottomPanelRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-background" />

            <div className="relative flex h-full flex-col items-center justify-center gap-6">
                <LeafMark className="h-8 w-8 text-accent" />
                <span
                    ref={counterRef}
                    className="font-mono text-6xl font-bold tabular-nums text-foreground md:text-8xl"
                >
                    000
                </span>
                <div className="h-px w-40 overflow-hidden bg-border">
                    <div ref={barRef} className="h-full w-0 bg-primary" />
                </div>
            </div>
        </div>
    );
}
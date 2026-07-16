"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function MagneticButton({
    children,
    onClick,
}: {
    children: ReactNode;
    onClick?: () => void;
}) {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });

    function handleMouseMove(event: MouseEvent<HTMLButtonElement>) {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const relativeX = event.clientX - (rect.left + rect.width / 2);
        const relativeY = event.clientY - (rect.top + rect.height / 2);
        x.set(relativeX * 0.35);
        y.set(relativeY * 0.35);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ x: springX, y: springY }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full bg-primary px-8 py-4 font-sans text-base font-medium text-primary-foreground transition-colors hover:brightness-110"
        >
            {children}
        </motion.button>
    );
}   
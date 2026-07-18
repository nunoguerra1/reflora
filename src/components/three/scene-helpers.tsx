"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export function usePrefersReducedMotion() {
    return useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);
}

function pseudoRandom(seed: number) {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
}

export function AmbientDust({ count = 180 }: { count?: number }) {
    const pointsRef = useRef<THREE.Points>(null);
    const reducedMotion = usePrefersReducedMotion();

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (pseudoRandom(i * 1.7) - 0.5) * 7;
            arr[i * 3 + 1] = (pseudoRandom(i * 3.1 + 10) - 0.5) * 6;
            arr[i * 3 + 2] = (pseudoRandom(i * 5.3 + 20) - 0.5) * 5;
        }
        return arr;
    }, [count]);

    useFrame((_, delta) => {
        if (reducedMotion || !pointsRef.current) return;
        const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < count; i++) {
            const y = posAttr.getY(i) + delta * 0.035;
            posAttr.setY(i, y > 3 ? -3 : y);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#C7D3BE"
                size={0.018}
                sizeAttenuation
                depthWrite={false}
                opacity={0.5}
            />
        </Points>
    );
}

export function useLivelyMotion(
    groupRef: RefObject<THREE.Group | null>,
    scrollProgressRef?: RefObject<number>
) {
    const reducedMotion = usePrefersReducedMotion();
    const baseRotation = useRef(0);

    useFrame((state, delta) => {
        if (reducedMotion || !groupRef.current) return;

        baseRotation.current += delta * 0.08;
        const scrollSpin = (scrollProgressRef?.current ?? 0) * 1.4;
        groupRef.current.rotation.y = baseRotation.current + scrollSpin;

        const targetX = state.pointer.y * 0.12;
        const targetZ = -state.pointer.x * 0.08;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.04);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, 0.04);
    });
}
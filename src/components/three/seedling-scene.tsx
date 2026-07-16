"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";

function usePrefersReducedMotion() {
    return useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);
}

function Seedling() {
    const groupRef = useRef<THREE.Group>(null);
    const reducedMotion = usePrefersReducedMotion();

    useFrame((state, delta) => {
        if (reducedMotion || !groupRef.current) return;
        groupRef.current.rotation.y += delta * 0.15;
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    });

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            <Sphere args={[1, 32, 32]} scale={[0.55, 0.75, 0.55]}>
                <meshStandardMaterial color="#6B4A2E" roughness={0.75} />
            </Sphere>

            <Cylinder args={[0.03, 0.05, 1.4, 12]} position={[0, 0.9, 0]} rotation={[0, 0, 0.08]}>
                <meshStandardMaterial color="#7A9B5C" roughness={0.5} />
            </Cylinder>

            <Sphere args={[1, 16, 16]} position={[-0.35, 1.55, 0]} rotation={[0.3, 0.5, 0.6]} scale={[0.55, 0.28, 0.05]}>
                <meshStandardMaterial color="#8BAF52" roughness={0.4} />
            </Sphere>

            <Sphere args={[1, 16, 16]} position={[0.35, 1.65, 0]} rotation={[-0.3, -0.5, -0.6]} scale={[0.55, 0.28, 0.05]}>
                <meshStandardMaterial color="#8BAF52" roughness={0.4} />
            </Sphere>
        </group>
    );
}

function pseudoRandom(seed: number) {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
}

function FloatingParticles({ count = 300 }: { count?: number }) {
    const pointsRef = useRef<THREE.Points>(null);
    const reducedMotion = usePrefersReducedMotion();

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (pseudoRandom(i * 1.7) - 0.5) * 8;
            arr[i * 3 + 1] = (pseudoRandom(i * 3.1 + 10) - 0.5) * 8;
            arr[i * 3 + 2] = (pseudoRandom(i * 5.3 + 20) - 0.5) * 8;
        }
        return arr;
    }, [count]);

    useFrame((_, delta) => {
        if (reducedMotion || !pointsRef.current) return;
        const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < count; i++) {
            const y = posAttr.getY(i) + delta * 0.05;
            posAttr.setY(i, y > 4 ? -4 : y);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <Points ref={pointsRef} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#C7D3BE"
                size={0.02}
                sizeAttenuation
                depthWrite={false}
                opacity={0.6}
            />
        </Points>
    );
}

export function SeedlingScene() {
    return (
        <Canvas camera={{ position: [0, 0.5, 4.5], fov: 42 }} dpr={[1, 2]}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 4, 2]} intensity={1.2} color="#F1F3ED" />
            <pointLight position={[-3, -1, -2]} intensity={0.5} color="#8BAF52" />
            <Seedling />
            <FloatingParticles />
        </Canvas>
    );
}
"use client";

import { useMemo, useRef, type MutableRefObject, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { getStageOpacity } from "@/lib/growth-stages";

function usePrefersReducedMotion() {
    return useMemo(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);
}

function useStageFade(
    groupRef: RefObject<THREE.Group | null>,
    progressRef: MutableRefObject<number>,
    stageIndex: number
) {
    useFrame(() => {
        const group = groupRef.current;
        if (!group) return;
        const value = getStageOpacity(progressRef.current, stageIndex);
        group.visible = value > 0.01;
        group.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                const material = obj.material as THREE.MeshStandardMaterial;
                material.transparent = true;
                material.opacity = value;
            }
        });
    });
}

function SeedStage({ progressRef }: { progressRef: MutableRefObject<number> }) {
    const groupRef = useRef<THREE.Group>(null);
    useStageFade(groupRef, progressRef, 0);

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            <Sphere args={[1, 32, 32]} scale={[0.4, 0.5, 0.4]}>
                <meshStandardMaterial color="#6B4A2E" roughness={0.75} />
            </Sphere>
        </group>
    );
}

function SproutStage({ progressRef }: { progressRef: MutableRefObject<number> }) {
    const groupRef = useRef<THREE.Group>(null);
    useStageFade(groupRef, progressRef, 1);

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            <Sphere args={[1, 32, 32]} scale={[0.35, 0.45, 0.35]}>
                <meshStandardMaterial color="#6B4A2E" roughness={0.75} />
            </Sphere>
            <Cylinder args={[0.025, 0.04, 0.9, 12]} position={[0, 0.55, 0]}>
                <meshStandardMaterial color="#7A9B5C" roughness={0.5} />
            </Cylinder>
            <Sphere args={[1, 16, 16]} position={[-0.22, 0.95, 0]} rotation={[0.3, 0.5, 0.6]} scale={[0.35, 0.18, 0.04]}>
                <meshStandardMaterial color="#8BAF52" roughness={0.4} />
            </Sphere>
            <Sphere args={[1, 16, 16]} position={[0.22, 1.0, 0]} rotation={[-0.3, -0.5, -0.6]} scale={[0.35, 0.18, 0.04]}>
                <meshStandardMaterial color="#8BAF52" roughness={0.4} />
            </Sphere>
        </group>
    );
}

function SaplingStage({ progressRef }: { progressRef: MutableRefObject<number> }) {
    const groupRef = useRef<THREE.Group>(null);
    useStageFade(groupRef, progressRef, 2);

    const leafPositions: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [
        { pos: [-0.3, 1.1, 0], rot: [0.3, 0.5, 0.7] },
        { pos: [0.3, 1.25, 0.05], rot: [-0.3, -0.5, -0.7] },
        { pos: [0, 1.6, -0.28], rot: [0.6, 0, 0.1] },
        { pos: [0.05, 1.75, 0.28], rot: [-0.6, 0, -0.1] },
    ];

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            <Cylinder args={[0.05, 0.07, 2.0, 12]} position={[0, 1.0, 0]}>
                <meshStandardMaterial color="#6E5A3D" roughness={0.6} />
            </Cylinder>
            {leafPositions.map((leaf, i) => (
                <Sphere key={i} args={[1, 16, 16]} position={leaf.pos} rotation={leaf.rot} scale={[0.4, 0.2, 0.05]}>
                    <meshStandardMaterial color="#8BAF52" roughness={0.4} />
                </Sphere>
            ))}
        </group>
    );
}

function TreeStage({ progressRef }: { progressRef: MutableRefObject<number> }) {
    const groupRef = useRef<THREE.Group>(null);
    useStageFade(groupRef, progressRef, 3);

    const branches: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [
        { pos: [0.35, 2.1, 0], rot: [0, 0, -0.9] },
        { pos: [-0.32, 2.4, 0.1], rot: [0.1, 0, 0.85] },
        { pos: [0, 2.6, -0.3], rot: [-0.9, 0, 0] },
    ];

    const canopyBlobs: Array<{ pos: [number, number, number]; scale: number; color: string }> = [
        { pos: [0, 3.1, 0], scale: 0.95, color: "#8BAF52" },
        { pos: [0.55, 2.9, 0.1], scale: 0.65, color: "#7A9B5C" },
        { pos: [-0.5, 3.0, -0.15], scale: 0.7, color: "#7A9B5C" },
        { pos: [0.1, 3.4, 0.4], scale: 0.6, color: "#9AC468" },
        { pos: [-0.2, 3.5, -0.35], scale: 0.55, color: "#9AC468" },
    ];

    return (
        <group ref={groupRef} position={[0, -0.5, 0]}>
            <Cylinder args={[0.09, 0.14, 2.6, 14]} position={[0, 1.3, 0]}>
                <meshStandardMaterial color="#5A4630" roughness={0.8} />
            </Cylinder>
            {branches.map((branch, i) => (
                <Cylinder key={i} args={[0.03, 0.05, 0.9, 10]} position={branch.pos} rotation={branch.rot}>
                    <meshStandardMaterial color="#5A4630" roughness={0.8} />
                </Cylinder>
            ))}
            {canopyBlobs.map((blob, i) => (
                <Sphere key={i} args={[1, 20, 20]} position={blob.pos} scale={blob.scale}>
                    <meshStandardMaterial color={blob.color} roughness={0.55} />
                </Sphere>
            ))}
        </group>
    );
}

function GrowthRig({ progressRef }: { progressRef: MutableRefObject<number> }) {
    const rigRef = useRef<THREE.Group>(null);
    const reducedMotion = usePrefersReducedMotion();

    useFrame((state, delta) => {
        if (reducedMotion || !rigRef.current) return;
        rigRef.current.rotation.y += delta * 0.1;
    });

    return (
        <group ref={rigRef}>
            <SeedStage progressRef={progressRef} />
            <SproutStage progressRef={progressRef} />
            <SaplingStage progressRef={progressRef} />
            <TreeStage progressRef={progressRef} />
        </group>
    );
}

export function GrowthScene({ progressRef }: { progressRef: MutableRefObject<number> }) {
    return (
        <Canvas camera={{ position: [0, 1, 5.5], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.45} />
            <directionalLight position={[3, 5, 2]} intensity={1.3} color="#F1F3ED" />
            <pointLight position={[-3, 0, -2]} intensity={0.5} color="#8BAF52" />
            <GrowthRig progressRef={progressRef} />
        </Canvas>
    );
}
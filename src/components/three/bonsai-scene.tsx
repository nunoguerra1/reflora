"use client";

import { Suspense, useRef, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Sphere, Cylinder, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { AmbientDust, useLivelyMotion } from "./scene-helpers";

function Pot() {
    return (
        <Cylinder args={[0.85, 0.65, 0.5, 24]} position={[0, -1.05, 0]}>
            <meshStandardMaterial color="#2A241E" roughness={0.4} metalness={0.1} />
        </Cylinder>
    );
}

function Trunk() {
    return (
        <group>
            <Cylinder args={[0.14, 0.18, 1.1, 12]} position={[0, -0.35, 0]} rotation={[0, 0, 0.12]}>
                <meshStandardMaterial color="#4A3B2A" roughness={0.85} />
            </Cylinder>
            <Cylinder args={[0.09, 0.14, 1.0, 12]} position={[0.18, 0.58, 0]} rotation={[0, 0, -0.35]}>
                <meshStandardMaterial color="#4A3B2A" roughness={0.85} />
            </Cylinder>
            <Cylinder args={[0.05, 0.09, 0.6, 12]} position={[0.02, 1.28, 0]} rotation={[0, 0, 0.2]}>
                <meshStandardMaterial color="#4A3B2A" roughness={0.85} />
            </Cylinder>
        </group>
    );
}

function FoliagePad({
    position,
    scale,
    color,
}: {
    position: [number, number, number];
    scale: number;
    color: string;
}) {
    const offsets: Array<[number, number, number]> = [
        [0, 0, 0],
        [0.32, -0.08, 0.12],
        [-0.28, -0.05, -0.15],
        [0.05, 0.1, -0.25],
    ];
    return (
        <group position={position} scale={scale}>
            {offsets.map((o, i) => (
                <Sphere key={i} args={[1, 20, 20]} position={o} scale={0.55}>
                    <meshStandardMaterial color={color} roughness={0.6} />
                </Sphere>
            ))}
        </group>
    );
}

function Bonsai({ scrollProgressRef }: { scrollProgressRef?: MutableRefObject<number> }) {
    const groupRef = useRef<THREE.Group>(null);
    useLivelyMotion(groupRef, scrollProgressRef);

    return (
        <group ref={groupRef} position={[0, 0.3, 0]}>
            <Pot />
            <Trunk />
            <FoliagePad position={[0.25, 0.7, 0.1]} scale={0.55} color="#8BAF52" />
            <FoliagePad position={[-0.35, 1.05, -0.1]} scale={0.48} color="#7A9B5C" />
            <FoliagePad position={[0.05, 1.5, 0.15]} scale={0.42} color="#9AC468" />
        </group>
    );
}

export function BonsaiScene({ scrollProgressRef }: { scrollProgressRef?: MutableRefObject<number> }) {
    return (
        <Canvas camera={{ position: [2.4, 0.8, 3.6], fov: 40 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 2]} intensity={1.4} color="#F1F3ED" />
            <pointLight position={[-3, 0, -2]} intensity={0.4} color="#8BAF52" />
            <Bonsai scrollProgressRef={scrollProgressRef} />
            <AmbientDust />
            <ContactShadows position={[0, -1.3, 0]} opacity={0.5} scale={6} blur={2.5} far={2} />
            <Suspense fallback={null}>
                <Environment preset="forest" />
            </Suspense>
        </Canvas>
    );
}
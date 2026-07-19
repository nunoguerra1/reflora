"use client";

import { useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Cylinder, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";
import { AmbientDust } from "./scene-helpers";
import { BRANCHES, getRevealProgress } from "@/lib/canopy-branches";

function Trunk() {
    return (
        <Cylinder args={[0.12, 0.22, 2.6, 14]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color="#4A3B2A" roughness={0.85} />
        </Cylinder>
    );
}

function BranchWithCard({
    branch,
    index,
    revealRef,
}: {
    branch: (typeof BRANCHES)[number];
    index: number;
    revealRef: MutableRefObject<number>;
}) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!groupRef.current) return;
        const t = getRevealProgress(revealRef.current, index, BRANCHES.length);
        const eased = THREE.MathUtils.smoothstep(t, 0, 1);
        groupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.2, 1, eased));
        groupRef.current.visible = t > 0.02;
    });

    return (
        <group ref={groupRef}>
            <Cylinder
                args={[0.03, 0.06, 1.6, 10]}
                position={branch.branchPos}
                rotation={branch.branchRot}
            >
                <meshStandardMaterial color="#4A3B2A" roughness={0.85} />
            </Cylinder>

            {[0, 0.32, -0.28].map((offset, i) => (
                <Sphere
                    key={i}
                    args={[1, 18, 18]}
                    position={[
                        branch.foliagePos[0] + offset,
                        branch.foliagePos[1] + (i === 0 ? 0.1 : -0.05),
                        branch.foliagePos[2] + (i === 1 ? 0.1 : -0.1),
                    ]}
                    scale={0.5}
                >
                    <meshStandardMaterial color={i === 0 ? "#8BAF52" : "#7A9B5C"} roughness={0.5} />
                </Sphere>
            ))}

            <Html position={branch.foliagePos} center distanceFactor={6} zIndexRange={[10, 0]}>
                <div className="w-48 rounded-xl border border-border bg-background/90 p-4 text-left backdrop-blur-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 font-display text-sm font-bold text-foreground">
                        {branch.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{branch.description}</p>
                </div>
            </Html>
        </group>
    );
}

export function CanopyScene({ scrollProgressRef }: { scrollProgressRef: MutableRefObject<number> }) {
    return (
        <Canvas camera={{ position: [0, 2, 6.5], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 2]} intensity={1.3} color="#F1F3ED" />
            <pointLight position={[-3, 1, -2]} intensity={0.4} color="#8BAF52" />
            <Trunk />
            {BRANCHES.map((branch, i) => (
                <BranchWithCard key={branch.id} branch={branch} index={i} revealRef={scrollProgressRef} />
            ))}
            <AmbientDust />
        </Canvas>
    );
}
"use client";

import { Suspense, useRef, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";
import * as THREE from "three";
import { AmbientDust, useLivelyMotion } from "./scene-helpers";

function RealPlantModel({ scrollProgressRef }: { scrollProgressRef?: MutableRefObject<number> }) {
    const { scene } = useGLTF("/models/bonsai.glb");
    const groupRef = useRef<THREE.Group>(null);
    useLivelyMotion(groupRef, scrollProgressRef);

    return (
        <group ref={groupRef}>
            <Center>
                <primitive object={scene} scale={1.4} />
            </Center>
        </group>
    );
}

useGLTF.preload("/models/bonsai.glb");

export function RealBonsaiScene({ scrollProgressRef }: { scrollProgressRef?: MutableRefObject<number> }) {
    return (
        <Canvas camera={{ position: [2.4, 0.8, 3.6], fov: 40 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 2]} intensity={1.4} color="#F1F3ED" />
            <pointLight position={[-3, 0, -2]} intensity={0.4} color="#8BAF52" />
            <Suspense fallback={null}>
                <RealPlantModel scrollProgressRef={scrollProgressRef} />
                <Environment preset="forest" />
            </Suspense>
            <AmbientDust />
            <ContactShadows position={[0, -1.3, 0]} opacity={0.5} scale={6} blur={2.5} far={2} />
        </Canvas>
    );
}
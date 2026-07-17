"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";

function RealBonsaiModel() {
    const { scene } = useGLTF("/models/Bonsai.glb");
    return (
        <Center>
            <primitive object={scene} scale={1.4} />
        </Center>
    );
}

useGLTF.preload("/models/bonsai.glb");

export function RealBonsaiScene() {
    return (
        <Canvas camera={{ position: [2.4, 0.8, 3.6], fov: 40 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 2]} intensity={1.4} color="#F1F3ED" />
            <Suspense fallback={null}>
                <RealBonsaiModel />
                <Environment preset="forest" />
            </Suspense>
            <ContactShadows position={[0, -1.3, 0]} opacity={0.5} scale={6} blur={2.5} far={2} />
        </Canvas>
    );
}
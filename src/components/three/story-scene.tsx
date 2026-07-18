"use client";

import { Suspense, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";
import * as THREE from "three";
import { AmbientDust } from "./scene-helpers";
import { CAMERA_BEATS } from "@/lib/story-beats";

function getCameraTarget(progress: number): THREE.Vector3 {
    const segment = 1 / (CAMERA_BEATS.length - 1);
    const rawIndex = progress / segment;
    const index = THREE.MathUtils.clamp(Math.floor(rawIndex), 0, CAMERA_BEATS.length - 2);
    const localT = THREE.MathUtils.clamp(rawIndex - index, 0, 1);

    const from = CAMERA_BEATS[index].position;
    const to = CAMERA_BEATS[index + 1].position;

    return new THREE.Vector3(
        THREE.MathUtils.lerp(from[0], to[0], localT),
        THREE.MathUtils.lerp(from[1], to[1], localT),
        THREE.MathUtils.lerp(from[2], to[2], localT)
    );
}

function CameraRig({ scrollProgressRef }: { scrollProgressRef: MutableRefObject<number> }) {
    const { camera } = useThree();

    useFrame(() => {
        const target = getCameraTarget(scrollProgressRef.current);
        camera.position.lerp(target, 0.12);
        camera.lookAt(0, 0.4, 0);
    });

    return null;
}

function StaticPlant() {
    const { scene } = useGLTF("/models/bonsai.glb");
    return (
        <Center>
            <primitive object={scene} scale={1.4} />
        </Center>
    );
}

useGLTF.preload("/models/bonsai.glb");

export function StoryScene({ scrollProgressRef }: { scrollProgressRef: MutableRefObject<number> }) {
    return (
        <Canvas camera={{ position: CAMERA_BEATS[0].position, fov: 40 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 5, 2]} intensity={1.4} color="#F1F3ED" />
            <pointLight position={[-3, 0, -2]} intensity={0.4} color="#8BAF52" />
            <CameraRig scrollProgressRef={scrollProgressRef} />
            <Suspense fallback={null}>
                <StaticPlant />
                <Environment preset="forest" />
            </Suspense>
            <AmbientDust />
            <ContactShadows position={[0, -1.3, 0]} opacity={0.5} scale={6} blur={2.5} far={2} />
        </Canvas>
    );
}
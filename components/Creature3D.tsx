"use client";

import { Component, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

// Physically-based materials (metalness/roughness) reflect an environment
// map — without one, metallic surfaces render pure black under plain
// directional lights. This generates a simple procedural room environment
// (no external HDRI file needed) so any PBR-authored GLB shows up correctly
// instead of looking "broken."
function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    // The scene is the external Three.js render target synchronized by this effect.
    // eslint-disable-next-line react-hooks/immutability
    scene.environment = envTex;
    pmrem.dispose();
    return () => {
      envTex.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);
  return null;
}

// A real, honest 3D viewer for the one working prototype model
// (public/monsters/3d/monster.glb). No drei dependency — plain
// three.js loaders/controls wired directly into @react-three/fiber v9
// (React 19 compatible). Lazy-loaded by the caller.

function Model({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url);
  const ref = useRef<THREE.Group>(null);
  useEffect(() => {
    if (!ref.current) return;
    // center + normalize scale so any model fills the viewport predictably
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.2 / maxDim;
    ref.current.scale.setScalar(scale);
    ref.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [gltf]);
  return <primitive ref={ref} object={gltf.scene} />;
}

function Controls() {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1.5;
    controls.maxDistance = 8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;
    let raf = 0;
    const tick = () => { controls.update(); raf = requestAnimationFrame(tick); };
    tick();
    const stopAutoRotate = () => { controls.autoRotate = false; };
    gl.domElement.addEventListener("pointerdown", stopAutoRotate, { once: true });
    return () => { cancelAnimationFrame(raf); controls.dispose(); };
  }, [camera, gl]);
  return null;
}

export default function Creature3D({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const { t } = useLang();

  useEffect(() => {
    let available = false;
    try {
      const canvas = document.createElement("canvas");
      available = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch { /* use the static preview */ }
    const timer = window.setTimeout(() => setWebglAvailable(available), 0);
    return () => clearTimeout(timer);
  }, []);

  if (failed || webglAvailable === false) {
    return (
      <div className="model-fallback">
        <Image src="/monsters/dragon_fire.png" alt="Fire Dragon preview" fill sizes="(max-width: 760px) 90vw, 900px" style={{ objectFit: "contain" }} />
        <span className="font-mono model-fallback__message">
          {t({ en: "Static preview · 3D is unavailable in this browser", ja: "静止画プレビュー · このブラウザでは3D表示を利用できません" })}
        </span>
      </div>
    );
  }

  if (webglAvailable === null) {
    return <div className="model-fallback"><Image src="/monsters/dragon_fire.png" alt="Fire Dragon preview" fill priority sizes="(max-width: 760px) 90vw, 900px" style={{ objectFit: "contain" }} /></div>;
  }

  return (
    <ErrorBoundary onError={() => setFailed(true)}>
      <Canvas camera={{ position: [0, 0.6, 4], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <Environment />
        <ambientLight intensity={1.4} />
        <hemisphereLight args={["#ffffff", "#222233", 1.2]} />
        <directionalLight position={[3, 4, 5]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-3, -2, -4]} intensity={1.2} color="#ff2ee0" />
        <Suspense fallback={null}>
          <Model url={src} />
        </Suspense>
        <Controls />
      </Canvas>
    </ErrorBoundary>
  );
}

// Minimal class-based error boundary — @react-three/fiber render errors
// (bad GLB, WebGL unavailable) must not crash the whole page.
class ErrorBoundary extends Component<
  { children: React.ReactNode; onError: () => void },
  { errored: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { errored: false };
  }
  static getDerivedStateFromError() { return { errored: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.errored ? null : this.props.children; }
}

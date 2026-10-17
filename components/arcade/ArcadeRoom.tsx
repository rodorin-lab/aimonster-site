"use client";
import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Group } from "three";
import { arcadeGames } from "@/lib/arcade";

function CameraControls() {
  const {camera,gl,invalidate}=useThree();
  useEffect(()=>{const controls=new OrbitControls(camera,gl.domElement);controls.target.set(0,1,-1);controls.minDistance=6;controls.maxDistance=18;controls.maxPolarAngle=Math.PI*.47;controls.minPolarAngle=.3;controls.enablePan=false;const changed=()=>invalidate();controls.addEventListener("change",changed);controls.update();return()=>{controls.dispose();};},[camera,gl,invalidate]);
  return null;
}
function Cabinet({index,active,onSelect}:{index:number;active:boolean;onSelect:(i:number)=>void}) {
  const g=arcadeGames[index];
  return <group position={g.position} onClick={e=>{e.stopPropagation();onSelect(index);}} onPointerOver={()=>{document.body.style.cursor="pointer";}} onPointerOut={()=>{document.body.style.cursor="";}}>
    <mesh position={[0,1.1,0]}><boxGeometry args={[1.7,2.2,1]}/><meshStandardMaterial color="#11192e" metalness={.5} roughness={.3}/></mesh>
    <mesh position={[0,1.5,.52]} rotation={[-.12,0,0]}><boxGeometry args={[1.4,1.05,.08]}/><meshStandardMaterial color={g.color} emissive={g.color} emissiveIntensity={active?1.6:.45}/></mesh>
    <mesh position={[0,2.35,0]}><boxGeometry args={[1.9,.35,1.15]}/><meshStandardMaterial color={g.color} emissive={g.color} emissiveIntensity={active?1:.2}/></mesh>
    <mesh position={[0,.85,.7]} rotation={[.2,0,0]}><boxGeometry args={[1.75,.17,.65]}/><meshStandardMaterial color="#27324e"/></mesh>
    {[-.5,.35,.6].map((x,i)=><mesh key={i} position={[x,1,.8]}><cylinderGeometry args={[.09,.09,i===0?.3:.09,12]}/><meshStandardMaterial color={g.color} emissive={g.color} emissiveIntensity={.6}/></mesh>)}
    <mesh position={[0,.04,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.15,active?1.4:1.2,48]}/><meshBasicMaterial color={g.color}/></mesh>
    <mesh position={[0,3.2,0]}><octahedronGeometry args={[active?.35:.18]}/><meshStandardMaterial color={g.color} emissive={g.color} emissiveIntensity={1}/></mesh>
  </group>;
}
function Satellite({motion}:{motion:boolean}) {
  const ref=useRef<Group>(null);
  useFrame(({clock})=>{if(ref.current&&motion){ref.current.rotation.y=clock.elapsedTime*.12;}});
  return <group ref={ref} position={[0,4.8,-3]}><mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[1.5,.035,8,80]}/><meshBasicMaterial color="#a276ff"/></mesh><mesh rotation={[.4,0,.5]}><torusGeometry args={[1.15,.025,8,80]}/><meshBasicMaterial color="#3cfff0"/></mesh><mesh><icosahedronGeometry args={[.55,0]}/><meshStandardMaterial color="#ede3ff" wireframe emissive="#985cff" emissiveIntensity={2}/></mesh></group>;
}
export default function ArcadeRoom({active,onSelect,motion}:{active:number;onSelect:(i:number)=>void;motion:boolean}) {
  useEffect(()=>()=>{document.body.style.cursor="";},[]);
  return <Canvas frameloop={motion?"always":"demand"} dpr={[1,1.5]} camera={{position:[8,7,12],fov:45}} gl={{antialias:true}} fallback={<p>3D非対応です。下のゲーム一覧からそのまま遊べます。</p>}>
    <color attach="background" args={["#070916"]}/><fog attach="fog" args={["#070916",18,40]}/>
    <ambientLight intensity={1.4}/><directionalLight position={[2,8,4]} intensity={2} color="#afbcff"/>
    <pointLight position={[-4,3,1]} color="#ff7140" intensity={35}/><pointLight position={[4,3,1]} color="#b58bff" intensity={35}/>
    <mesh position={[0,-.15,0]}><cylinderGeometry args={[9,9.3,.3,64]}/><meshStandardMaterial color="#11192c" metalness={.4} roughness={.4}/></mesh>
    <gridHelper args={[18,24,"#60419e","#263152"]} position={[0,.015,0]}/>
    {[6,8.8].map(r=><mesh key={r} rotation={[-Math.PI/2,0,0]} position={[0,.025,0]}><ringGeometry args={[r,r+.04,96]}/><meshBasicMaterial color={r===6?"#bd68ff":"#36efea"}/></mesh>)}
    {arcadeGames.map((g,i)=><Cabinet key={g.id} index={i} active={active===i} onSelect={onSelect}/>)}
    {Array.from({length:18},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*14,2+(i%5)*1.5,Math.cos(i*2.4)*14]}><sphereGeometry args={[.035,6,6]}/><meshBasicMaterial color={i%2?"#77ffff":"#d39cff"}/></mesh>)}
    <Satellite motion={motion}/><CameraControls/>
  </Canvas>;
}

"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AtomDef { pos: [number,number,number]; color: string; radius: number; }
interface BondDef { from: number; to: number; }

const ATOMS: AtomDef[] = [
  { pos:[0,0,0],         color:"#4A7C5E", radius:0.22 },
  { pos:[0.8,0.5,0.1],   color:"#D4607A", radius:0.18 },
  { pos:[0.9,-0.5,-0.1], color:"#5E9E7A", radius:0.20 },
  { pos:[-0.8,0.5,0.2],  color:"#D4607A", radius:0.18 },
  { pos:[-0.9,-0.5,0],   color:"#4A7C5E", radius:0.20 },
  { pos:[0,1.0,-0.15],   color:"#C07A1A", radius:0.16 },
  { pos:[0,-1.0,0.15],   color:"#4A7C5E", radius:0.20 },
  { pos:[1.6,0.8,0],     color:"#D4EDE0", radius:0.12 },
  { pos:[-1.6,0.8,0.1],  color:"#D4EDE0", radius:0.12 },
];

const BONDS: BondDef[] = [
  {from:0,to:1},{from:0,to:2},{from:0,to:3},
  {from:0,to:4},{from:0,to:5},{from:0,to:6},
  {from:1,to:7},{from:3,to:8},{from:2,to:6},
  {from:4,to:6},{from:5,to:1},
];

function AtomMesh({ pos, color, radius }: AtomDef) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.set(pos[0], pos[1] + Math.sin(t * 1.2 + phase) * 0.04, pos[2]);
    const s = 1 + Math.sin(t * 2 + phase) * 0.04;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.2} emissive={color} emissiveIntensity={0.1} />
    </mesh>
  );
}

function BondMesh({ from, to }: BondDef) {
  const a   = ATOMS[from];
  const b   = ATOMS[to];
  const start = new THREE.Vector3(...a.pos);
  const end   = new THREE.Vector3(...b.pos);
  const mid   = start.clone().add(end).multiplyScalar(0.5);
  const dir   = end.clone().sub(start);
  const len   = dir.length();
  const q     = new THREE.Quaternion();
  q.setFromUnitVectors(new THREE.Vector3(0,1,0), dir.clone().normalize());
  return (
    <mesh position={mid} quaternion={q}>
      <cylinderGeometry args={[0.022, 0.022, len, 6]} />
      <meshStandardMaterial color="#C8DDD2" roughness={0.6} metalness={0.1} transparent opacity={0.65} />
    </mesh>
  );
}

export function MoleculeViewer({ scale = 1, autoRotate = true }: { scale?: number; autoRotate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current || !autoRotate) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.35;
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.18;
  });
  return (
    <group ref={groupRef} scale={scale}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4,6,4]} intensity={1.2} color="#EAF5EF" />
      <directionalLight position={[-4,-2,-4]} intensity={0.4} color="#D4EDE0" />
      <pointLight position={[0,3,3]} intensity={0.8} color="#4A7C5E" distance={12} />
      {ATOMS.map((a, i) => <AtomMesh key={i} {...a} />)}
      {BONDS.map((b, i) => <BondMesh key={i} {...b} />)}
    </group>
  );
}

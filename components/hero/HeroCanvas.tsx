'use client';
import { Canvas } from '@react-three/fiber';

export default function HeroCanvas() {
  return (
    <Canvas
      className="!fixed inset-0 h-screen w-screen"
      gl={{ antialias: true }}
      camera={{ position: [2.6, 1.5, 4.2], fov: 40 }}
      onCreated={({ gl }) => gl.setClearColor('#7B1E2B', 1)}
    >
      <ambientLight intensity={0.6} />
      <mesh>
        <boxGeometry args={[1, 2, 0.1]} />
        <meshStandardMaterial color="#EADFCF" />
      </mesh>
    </Canvas>
  );
}

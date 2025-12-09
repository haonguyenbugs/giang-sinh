import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BackgroundParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, count } = useMemo(() => {
    const particleCount = 2000;
    const pos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Distribute particles in a sphere around the scene
      const radius = 15 + Math.random() * 25;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5 - 2; // Flatten vertically
      pos[i3 + 2] = radius * Math.cos(phi);
    }

    return { positions: pos, count: particleCount };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    // Very slow rotation for ambient effect
    pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default BackgroundParticles;

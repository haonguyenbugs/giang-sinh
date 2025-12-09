import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SnowParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities, count } = useMemo(() => {
    const particleCount = 400;
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 25;
      pos[i3 + 1] = Math.random() * 18 - 6;
      pos[i3 + 2] = (Math.random() - 0.5) * 25;
      vel[i] = 0.3 + Math.random() * 0.7;
    }

    return { positions: pos, velocities: vel, count: particleCount };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Fall down
      pos[i3 + 1] -= velocities[i] * 0.015;
      
      // Gentle sway
      pos[i3] += Math.sin(time * 0.5 + i * 0.1) * 0.003;
      pos[i3 + 2] += Math.cos(time * 0.3 + i * 0.15) * 0.003;

      // Reset when below ground
      if (pos[i3 + 1] < -6) {
        pos[i3 + 1] = 12;
        pos[i3] = (Math.random() - 0.5) * 25;
        pos[i3 + 2] = (Math.random() - 0.5) * 25;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
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
        size={0.06}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default SnowParticles;

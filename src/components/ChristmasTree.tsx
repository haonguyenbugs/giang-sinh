import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChristmasTreeProps {
  onTreeComplete: () => void;
}

const ChristmasTree = ({ onTreeComplete }: ChristmasTreeProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const animationStartTime = useRef(Date.now());
  const hasCompleted = useRef(false);

  
  const { initialPositions, targetPositions, count, sizes } = useMemo(() => {
    const particleCount = 8000;
    const initial = new Float32Array(particleCount * 3);
    const target = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      
      const t = i / particleCount;
      const height = t * 5.5 - 1.5;
      const radius = Math.max(0, (1 - t) * 2.8 + 0.05);
      const angle = t * 25 * Math.PI + (Math.random() - 0.5) * 0.3;

      const randomRadius = radius * (0.85 + Math.random() * 0.3);

      target[i3] = Math.cos(angle) * randomRadius;
      target[i3 + 1] = height;
      target[i3 + 2] = Math.sin(angle) * randomRadius;

      
      const startAngle = (i / particleCount) * Math.PI * 6;
      const startRadius = 0.2 + Math.random() * 0.3;
      initial[i3] = Math.cos(startAngle) * startRadius;
      initial[i3 + 1] = -3;
      initial[i3 + 2] = Math.sin(startAngle) * startRadius;

      particleSizes[i] = 0.03 + Math.random() * 0.04;
    }

    return {
      initialPositions: initial,
      targetPositions: target,
      count: particleCount,
      sizes: particleSizes,
    };
  }, []);

  
  useFrame(() => {
    if (!pointsRef.current) return;

    const elapsed = (Date.now() - animationStartTime.current) / 1000;
    const duration = 5;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const rawProgress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(rawProgress);

    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const time = elapsed;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      const particleDelay = (i / count) * 0.6;
      const particleProgress = Math.max(
        0,
        Math.min(1, (easedProgress - particleDelay) / (1 - particleDelay)),
      );

      const spiralProgress = easeOutQuart(particleProgress);

      const transitionAngle = (1 - spiralProgress) * Math.PI * 4 * (i / count);
      const transitionRadius = (1 - spiralProgress) * 0.5;

      const baseX = THREE.MathUtils.lerp(
        initialPositions[i3],
        targetPositions[i3],
        spiralProgress,
      );
      const baseY = THREE.MathUtils.lerp(
        initialPositions[i3 + 1],
        targetPositions[i3 + 1],
        spiralProgress,
      );
      const baseZ = THREE.MathUtils.lerp(
        initialPositions[i3 + 2],
        targetPositions[i3 + 2],
        spiralProgress,
      );

      positions[i3] = baseX + Math.cos(transitionAngle) * transitionRadius;
      positions[i3 + 1] = baseY;
      positions[i3 + 2] = baseZ + Math.sin(transitionAngle) * transitionRadius;

      
      if (spiralProgress >= 0.95) {
        const twinkle = Math.sin(time * 2 + i * 0.05) * 0.015;
        positions[i3] += twinkle;
        positions[i3 + 2] += twinkle * 0.5;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    if (rawProgress >= 1 && !hasCompleted.current) {
      hasCompleted.current = true;
      onTreeComplete();
    }
  });

  return (
    <>
      
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.15, 0]} 
        receiveShadow
      >
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={initialPositions.slice()}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>

        <pointsMaterial
            size={0.045}
            color="#ffffff"
            transparent
            opacity={0.95}
            sizeAttenuation
            depthWrite={false}     
            blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};

export default ChristmasTree;

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChristmasStarProps {
  visible: boolean;
}

const ChristmasStar = ({ visible }: ChristmasStarProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);
  const animationStartTime = useRef<number | null>(null);

  useEffect(() => {
    if (visible && animationStartTime.current === null) {
      animationStartTime.current = Date.now();
    }
  }, [visible]);

  useFrame(() => {
    if (!meshRef.current || !visible) return;

    
    if (animationStartTime.current) {
      const elapsed = (Date.now() - animationStartTime.current) / 1000;
      const duration = 1;
      
      
      const elasticOut = (t: number) => {
        const p = 0.4;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
      };
      
      const progress = Math.min(elapsed / duration, 1);
      const newScale = elasticOut(progress) * 0.6; 
      setScale(newScale);
      meshRef.current.scale.setScalar(newScale);
      if (glowRef.current) {
        glowRef.current.scale.setScalar(newScale * 1.8);
      }
    }

    
    meshRef.current.rotation.y += 0.008;
    meshRef.current.rotation.z = Math.sin(Date.now() * 0.0008) * 0.08;

    if (glowRef.current) {
      glowRef.current.rotation.y += 0.004;
    }
  });

  if (!visible) return null;

  
  const starShape = new THREE.Shape();
  const outerRadius = 0.35; 
  const innerRadius = 0.14;
  const spikes = 5;

  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    if (i === 0) {
      starShape.moveTo(x, y);
    } else {
      starShape.lineTo(x, y);
    }
  }
  starShape.closePath();

  const extrudeSettings = {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
  };

  return (
    <group position={[0, 4.2, 0]}>
      
      <mesh ref={meshRef} scale={0}>
        <extrudeGeometry args={[starShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      
      <pointLight
        color="#ffffff"
        intensity={scale * 1.5}
        distance={4}
        decay={2}
      />
    </group>
  );
};

export default ChristmasStar;

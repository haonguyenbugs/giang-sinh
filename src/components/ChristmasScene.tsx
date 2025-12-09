import { Canvas } from '@react-three/fiber';
import { useState, useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ChristmasTree from './ChristmasTree';
import ChristmasStar from './ChristmasStar';
import SnowParticles from './SnowParticles';
import BackgroundParticles from './BackgroundParticles';
import Ground from './Ground';

// Optimized camera controller for smooth slow orbit
const CameraController = () => {
  const cameraRef = useRef({ angle: 0 });

  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime();
    cameraRef.current.angle = time * 0.08;
    
    const radius = 11;
    const height = 2 + Math.sin(time * 0.1) * 0.5;
    
    camera.position.x = Math.sin(cameraRef.current.angle) * radius;
    camera.position.z = Math.cos(cameraRef.current.angle) * radius;
    camera.position.y = height;
    camera.lookAt(0, 1.5, 0);
  });

  return null;
};

interface ChristmasSceneProps {
  onTreeComplete: () => void;
}

const ChristmasScene = ({ onTreeComplete }: ChristmasSceneProps) => {
  const [showStar, setShowStar] = useState(false);

  const handleTreeComplete = () => {
    setTimeout(() => {
      setShowStar(true);
      onTreeComplete();
    }, 300);
  };

  return (
    <Canvas
      camera={{ position: [0, 2, 11], fov: 55 }}
      style={{ background: '#000000' }}
      gl={{ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance'
      }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={['#000000']} />
      
      {/* Minimal lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 8, 5]} intensity={0.3} />
      
      <Suspense fallback={null}>
        <BackgroundParticles />
        
        {/* Ground placed BEFORE tree so it renders underneath */}
        <Ground />

        {/* Tree */}
        <ChristmasTree onTreeComplete={handleTreeComplete} />
        
        {/* Star */}
        <ChristmasStar visible={showStar} />

        {/* Snow particles */}
        <SnowParticles />
      </Suspense>

      <CameraController />
    </Canvas>
  );
};

export default ChristmasScene;

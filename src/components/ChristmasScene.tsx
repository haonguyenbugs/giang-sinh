import { Canvas } from '@react-three/fiber';
import { useState, useRef, Suspense, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ChristmasTree from './ChristmasTree';
import ChristmasStar from './ChristmasStar';
import SnowParticles from './SnowParticles';
import BackgroundParticles from './BackgroundParticles';
import Ground from './Ground';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/music.mp3');
    audioRef.current.volume = 0.7;
    audioRef.current.loop = true;

    const startMusic = () => {
      audioRef.current?.play().catch(() => {});
      document.removeEventListener("click", startMusic);
    };

    document.addEventListener("click", startMusic);

    return () => {
      document.removeEventListener("click", startMusic);
    };
  }, []);

  const handleTreeComplete = () => {
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }, 1000);

    setTimeout(() => {
      setShowStar(true);
      onTreeComplete();
    }, 1300);
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
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 8, 5]} intensity={0.3} />

      <Suspense fallback={null}>
        <BackgroundParticles />
        <Ground />
        <ChristmasTree onTreeComplete={handleTreeComplete} />
        <ChristmasStar visible={showStar} />
        <SnowParticles />
      </Suspense>

      <CameraController />
    </Canvas>
  );
};

export default ChristmasScene;

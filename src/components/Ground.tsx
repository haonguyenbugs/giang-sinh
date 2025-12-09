import { memo } from 'react';
import { MeshProps } from '@react-three/fiber';

const Ground = memo((props: MeshProps) => {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2.9, 0]}     
      receiveShadow
      {...props}
    >
      <planeGeometry args={[14, 14]} />
      <meshStandardMaterial color="#2b2b2b" /> 
    </mesh>
  );
});

export default Ground;

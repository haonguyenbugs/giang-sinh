import { useState } from 'react';
import ChristmasScene from '@/components/ChristmasScene';
import ChristmasOverlay from '@/components/ChristmasOverlay';

const Index = () => {
  const [treeComplete, setTreeComplete] = useState(false);

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <ChristmasScene onTreeComplete={() => setTreeComplete(true)} />
      </div>
      
      {/* Text Overlay */}
      <ChristmasOverlay showSubtitle={treeComplete} />
    </div>
  );
};

export default Index;

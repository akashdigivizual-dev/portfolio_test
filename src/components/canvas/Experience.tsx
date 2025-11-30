import { ScrollControls, Scroll } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Suspense } from 'react';
import Stars from './Stars';
import HeroGalaxy from './HeroGalaxy';
import SkillsConstellation from './SkillsConstellation';
import ProjectsPortal from './ProjectsPortal';
import AboutTimeline from './AboutTimeline';
import ContactNebula from './ContactNebula';

const Scene = () => {
  return (
    <>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 5, 30]} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
      
      <Suspense fallback={null}>
        <ScrollControls pages={8} damping={0.25}>
          <Scroll>
            <HeroGalaxy />
            <SkillsConstellation />
            <ProjectsPortal />
            <AboutTimeline />
            <ContactNebula />
          </Scroll>
        </ScrollControls>
        <Stars />
      </Suspense>

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.6} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};

const Experience = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ 
        antialias: false, 
        alpha: false, 
        powerPreference: "high-performance"
      }}
      dpr={[1, 2]}
      className="w-full h-screen"
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = 'auto';
      }}
    >
      <Scene />
    </Canvas>
  );
};

export default Experience;
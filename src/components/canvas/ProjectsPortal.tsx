import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useScroll, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { projects } from '@/utils/constants';

interface ProjectData {
  id: number;
  title: string;
  type: string;
  tech: string[];
  color: string;
  desc: string;
}

const ProjectPortal = ({ project, position, index }: { project: ProjectData, position: [number, number, number], index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  
  useCursor(hovered);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Rotate portal ring
    groupRef.current.rotation.z += delta * 0.5;
    
    // Hover effect
    const scale = hovered ? 1.1 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });

  return (
    <group position={position}>
      <group ref={groupRef} onClick={() => setActive(!active)} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        {/* Portal Ring */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[1.5, 0.1, 16, 32]} />
          <meshStandardMaterial 
            color={project.color} 
            emissive={project.color}
            emissiveIntensity={2}
          />
        </mesh>
        
        {/* Portal Interior (Wormhole) */}
        <mesh>
          <circleGeometry args={[1.4, 32]} />
          <meshBasicMaterial color="black" transparent opacity={0.9} />
        </mesh>

        {/* Placeholder for Project Screenshot */}
        <mesh position={[0, 0, -0.1]}>
           <planeGeometry args={[2, 1.2]} />
           <meshBasicMaterial color={project.color} wireframe />
        </mesh>
      </group>

      {/* Text Info */}
      <group position={[0, -2, 0]}>
        <Text
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="top"
          maxWidth={2.5}
          textAlign="center"
        >
          {project.title}
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.15}
          color={project.color}
          anchorX="center"
          anchorY="top"
        >
          {project.type}
        </Text>
      </group>
    </group>
  );
};

const ProjectsPortal = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // Parallax or scroll-based rotation for the whole gallery
    if (groupRef.current) {
       // Rotate the gallery slightly based on scroll
       // Adjusted for 8 pages. Section is at y=-20 (approx page 2.6)
       // Start rotating around page 2.5 (2.5/8 = 0.3125)
       const r2 = scroll.range(2.5/8, 1.5/8);
       groupRef.current.rotation.y = (r2 - 0.5) * 0.5;
    }
  });

  return (
    <group position={[0, -20, 0]} ref={groupRef}> {/* Positioned at Page 2 (approx -20 units) */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        PROJECTS PORTAL
      </Text>

      {projects.map((project, index) => {
        // Arrange in a semi-circle or horizontal line
        const x = (index - 2) * 4;
        return (
          <ProjectPortal 
            key={project.id} 
            project={project} 
            position={[x, 0, 0]} 
            index={index} 
          />
        );
      })}
    </group>
  );
};

export default ProjectsPortal;
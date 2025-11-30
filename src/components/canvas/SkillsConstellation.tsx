import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useScroll, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { skills } from '../../utils/constants';

interface SkillData {
  name: string;
  level: string;
  color: string;
  type: string;
}

const SkillOrb = ({ position, skill, index }: { position: [number, number, number], skill: SkillData, index: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Rotate orb
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
    
    // Pulse on hover
    const scaleTarget = hovered ? 1.5 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.1);
  });

  return (
    <group position={position}>
      <Trail width={0.2} length={4} color={new THREE.Color(skill.color)} attenuation={(t) => t * t}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <dodecahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={hovered ? 2 : 0.5}
            roughness={0.2}
            metalness={0.8}
            wireframe={!hovered}
          />
        </mesh>
      </Trail>
      
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="bottom"
        visible={hovered}
      >
        {skill.name}
      </Text>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.15}
        color={skill.color}
        anchorX="center"
        anchorY="top"
        visible={hovered}
      >
        {skill.level}
      </Text>
    </group>
  );
};

const SkillsConstellation = () => {
  const groupRef = useRef<THREE.Group>(null);
  const blackHoleRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  // Generate random initial positions for "chaos" state
  const randomPositions = useMemo(() => {
    return skills.map(() => [
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 5
    ]);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !blackHoleRef.current) return;

    // Black hole rotation
    blackHoleRef.current.rotation.z += delta * 0.5;
    blackHoleRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;

    // Animate orbs from chaos to order
    groupRef.current.children.forEach((child, i) => {
      if (i >= skills.length) return; // Skip non-orb children if any

      const angle = (i / skills.length) * Math.PI * 2 + state.clock.elapsedTime * 0.2;
      const radius = 3.5;
      
      // Target orbital position
      const targetX = Math.cos(angle) * radius;
      const targetY = Math.sin(angle) * radius * 0.5; // Elliptical orbit
      const targetZ = Math.sin(angle) * radius * 0.2;

      // Current random position
      const startX = randomPositions[i][0];
      const startY = randomPositions[i][1];
      const startZ = randomPositions[i][2];

      // Interpolate based on scroll
      // Adjusted for 8 pages. Section is at y=-10 (approx page 1.3)
      // Start assembling at page 1 (1/8 = 0.125)
      const progress = scroll.curve(1/8, 1/8); 

      child.position.x = THREE.MathUtils.lerp(startX, targetX, progress);
      child.position.y = THREE.MathUtils.lerp(startY, targetY, progress);
      child.position.z = THREE.MathUtils.lerp(startZ, targetZ, progress);
    });
  });

  return (
    <group position={[0, -10, 0]}> {/* Positioned roughly at page 1 */}
      
      {/* Central Black Hole */}
      <group ref={blackHoleRef}>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="black" />
        </mesh>
        {/* Accretion Disk */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 2.5, 64]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 1.3, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Skill Orbs Container */}
      <group ref={groupRef}>
        {skills.map((skill, index) => (
          <SkillOrb key={skill.name} position={[0,0,0]} skill={skill} index={index} />
        ))}
      </group>
      
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        SKILLS CONSTELLATION
      </Text>
    </group>
  );
};

export default SkillsConstellation;
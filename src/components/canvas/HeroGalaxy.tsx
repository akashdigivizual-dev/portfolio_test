import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Center, Float, useCursor } from '@react-three/drei';
import { heroContent } from '../../utils/constants';
import * as THREE from 'three';
import { Vector3 } from 'three';

const InteractiveOrb = ({ position, color, size = 0.5 }: { position: [number, number, number], color: string, size?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useCursor(hovered);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Mouse interaction (repel)
    const mouse = new Vector3(state.mouse.x * 5, state.mouse.y * 5, 0);
    const distance = meshRef.current.position.distanceTo(mouse);
    
    if (distance < 2) {
      const direction = meshRef.current.position.clone().sub(mouse).normalize();
      const targetPos = new Vector3(
        position[0] + direction.x,
        position[1] + direction.y,
        position[2] + direction.z
      );
      meshRef.current.position.lerp(targetPos, 0.1);
    } else {
      meshRef.current.position.lerp(new Vector3(...position), 0.05);
    }

    // Rotation
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        roughness={0.2}
        metalness={0.8}
        wireframe={hovered}
      />
    </mesh>
  );
};

const HeroGalaxy = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Parallax effect
      const { x, y } = state.mouse;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, y * 0.05, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.05, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center position={[0, 0.5, 0]}>
          <Text
            fontSize={1.5}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#00d4ff"
          >
            {heroContent.title}
            <meshStandardMaterial
              color="#ffffff"
              emissive="#00d4ff"
              emissiveIntensity={1}
              toneMapped={false}
            />
          </Text>
        </Center>
      </Float>

      {/* Interactive Orbs - Positioned to be visible */}
      <InteractiveOrb position={[-2.5, 1.5, -1]} color="#ff00ff" size={0.4} />
      <InteractiveOrb position={[2.5, -1, -1]} color="#00ff88" size={0.3} />
      <InteractiveOrb position={[-2, -2, -2]} color="#00d4ff" size={0.5} />
      <InteractiveOrb position={[3, 2, -2]} color="#ffffff" size={0.2} />

      {/* CTA Portal Effect Ring */}
      <group position={[0, -2.5, 0]} rotation={[Math.PI / 3, 0, 0]}>
        <mesh>
          <torusGeometry args={[1, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

export default HeroGalaxy;
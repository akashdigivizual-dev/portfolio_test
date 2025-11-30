import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line, useScroll, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { timelineData } from '../../utils/constants';

interface TimelineItem {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

const Milestone = ({ data, position, index }: { data: TimelineItem, position: THREE.Vector3, index: number }) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      const scale = hovered ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color={data.color}
            emissive={data.color}
            emissiveIntensity={hovered ? 2 : 0.5}
            wireframe
          />
        </mesh>
      </Float>

      {/* Connecting Line to Path */}
      <Line
        points={[[0, 0, 0], [0, -1, 0]]}
        color={data.color}
        lineWidth={1}
        transparent
        opacity={0.5}
      />

      {/* Text Info */}
      <group position={[0, 1.2, 0]}>
        <Text
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="bottom"
        >
          {data.year}
        </Text>
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.2}
          color={data.color}
          anchorX="center"
          anchorY="top"
        >
          {data.title}
        </Text>
        {hovered && (
          <Text
            position={[0, -0.6, 0]}
            fontSize={0.15}
            color="#cccccc"
            anchorX="center"
            anchorY="top"
            maxWidth={3}
            textAlign="center"
          >
            {data.description}
          </Text>
        )}
      </group>
    </group>
  );
};

const NoidaGlobe = ({ position }: { position: [number, number, number] }) => {
  const globeRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group position={position} ref={globeRef}>
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial
          color="#1e293b"
          emissive="#0f172a"
          emissiveIntensity={0.5}
          wireframe
        />
      </Sphere>
      {/* Location Pin for Noida */}
      <group position={[1.5, 0.5, 1]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.2, 0.5, 16]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#f43f5e" />
        </mesh>
      </group>
    </group>
  );
};

const AboutTimeline = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  // Create a curved path
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5, 0, 0),
      new THREE.Vector3(-2, 2, -2),
      new THREE.Vector3(2, -2, 2),
      new THREE.Vector3(6, 0, 0),
    ]);
  }, []);

  const points = useMemo(() => curve.getPoints(50), [curve]);

  useFrame(() => {
    if (groupRef.current) {
      // Parallax effect based on scroll
      const r3 = scroll.range(4/8, 2/8); 
      groupRef.current.position.x = -r3 * 2; 
    }
  });

  return (
    <group position={[0, -30, 0]} ref={groupRef}> 
      <Text
        position={[0, 6, 0]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        JOURNEY TIMELINE
      </Text>

      {/* The Path */}
      <Line
        points={points}
        color="#ffffff"
        lineWidth={2}
        dashed
        dashScale={2}
        dashSize={1}
        gapSize={0.5}
      />

      {/* Milestones */}
      {timelineData.map((item, index) => {
        const t = (index + 1) / (timelineData.length + 1);
        const pos = curve.getPoint(t);
        return (
          <Milestone
            key={index}
            data={item}
            position={pos}
            index={index}
          />
        );
      })}

      {/* Noida Globe at the end */}
      <NoidaGlobe position={[8, 0, -2]} />
    </group>
  );
};

export default AboutTimeline;
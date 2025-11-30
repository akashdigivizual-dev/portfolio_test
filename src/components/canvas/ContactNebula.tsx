import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random particles
  const [sphere] = useState(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      const r = 10 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00d4ff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

const ContactForm = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormState({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="w-[350px] md:w-[400px] p-8 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,212,255,0.2)]">
      <h3 className="text-2xl font-bold text-white mb-6 font-['Orbitron']">Initialize Contact</h3>
      
      {status === 'success' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10"
        >
          <div className="text-5xl mb-4">🚀</div>
          <p className="text-cyan-400 text-lg">Message Transmitted!</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-cyan-400/80 uppercase tracking-wider mb-1">Identity</label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-cyan-400/80 uppercase tracking-wider mb-1">Frequency (Email)</label>
            <input
              type="email"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-cyan-400/80 uppercase tracking-wider mb-1">Transmission</label>
            <textarea
              rows={4}
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-cyan-400/50 transition-colors resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 uppercase tracking-widest text-sm hover:bg-cyan-500/30 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all duration-300 rounded disabled:opacity-50"
          >
            {status === 'sending' ? 'Transmitting...' : 'Send Signal'}
          </button>
        </form>
      )}
    </div>
  );
};

const ContactNebula = () => {
  // Moved up to -45 to ensure visibility with 8 pages
  return (
    <group position={[0, -45, 0]}> 
      <ParticleField />
      
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Html transform position={[0, 0, 0]} zIndexRange={[100, 0]}>
          <ContactForm />
        </Html>
      </Float>
    </group>
  );
};

export default ContactNebula;
import { motion } from 'framer-motion';
import { heroContent } from '../../utils/constants';

const Overlay = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between">
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center pointer-events-auto z-50">
        <div className="text-white font-bold text-xl tracking-wider">AKASH.DEV</div>
        <button className="px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 group">
          <span className="group-hover:text-cyan-400 transition-colors">Contact</span>
        </button>
      </nav>
      
      {/* Hero Content Overlay - Only visible at top scroll */}
      <div className="flex-1 flex flex-col items-center justify-center mt-20">
        <div className="mt-32 text-center space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl text-white font-light tracking-[0.2em]"
          >
            {heroContent.subtitle}
          </motion.h2>
          
          <div className="h-8 overflow-hidden">
             <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-cyan-400/80 font-mono text-sm md:text-base"
             >
               &gt; {heroContent.tagline}<span className="animate-pulse">_</span>
             </motion.p>
          </div>
        </div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 pointer-events-auto px-8 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-none text-cyan-400 uppercase tracking-widest text-sm hover:bg-cyan-500/20 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all duration-300 backdrop-blur-sm"
        >
          Explore Portfolio
        </motion.button>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40"
      >
        <span className="text-[10px] text-white/30 uppercase tracking-widest">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0" />
      </motion.div>
    </div>
  );
};

export default Overlay;
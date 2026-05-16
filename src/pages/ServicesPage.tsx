import React from 'react';
import { Services } from '../components/sections/Services';
import { motion } from 'framer-motion';

export function ServicesPage() {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-32 pb-20"
    >
      <div className="container mx-auto px-6 mb-20 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-gold font-black uppercase text-xs tracking-[0.3em] mb-4"
        >
          Explore Our Solutions
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black font-heading mb-6"
        >
          Our <span className="text-brand-gold">Expertise</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 max-w-2xl mx-auto text-lg"
        >
          We provide a wide range of ICT services designed to help your business grow in the digital age.
        </motion.p>
      </div>

      <Services />
    </motion.main>
  );
}

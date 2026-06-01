/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route, ScrollRestoration, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar, Footer, WhatsAppButton } from './components/layout/Navigation';
import { AIChatbot } from './components/AIChatbot';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { BooksPage } from './pages/BooksPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { useWebsiteSettings } from './hooks/useWebsiteSettings';

// Scroll to top on route change component for React Router
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
        return () => clearTimeout(timer);
      }
    }
    // Default to top of the page smoothly
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

const backgroundMap = {
  slate: 'bg-slate-950',
  navy: 'bg-[#020617]',
  emerald: 'bg-[#021c11]',
  charcoal: 'bg-[#090d16]',
  pitchBlack: 'bg-black'
};

export default function App() {
  const { settings } = useWebsiteSettings();
  const bgClass = backgroundMap[settings?.theme?.bgTone || 'slate'] || 'bg-slate-950';

  // Mouse tracking context for professional interactive spotlight
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Stabilize randomized premium ambient particles
  const ambientParticles = React.useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1.5, // 1.5px to 4.5px
      x: Math.random() * 100, // percentage x coordinate
      y: Math.random() * 100, // percentage y coordinate
      duration: Math.random() * 25 + 20, // 20s to 45s slow float
      delay: Math.random() * -20 // offset start to avoid pop-in
    }));
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className={`min-h-screen ${bgClass} selection:bg-brand-gold selection:text-brand-black relative overflow-hidden transition-colors duration-[1000ms]`}>
          
          {/* Website Main Dynamic Background (Sky Blue, White, Green, and White-Yellow theme) */}
          <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
            {/* Subtle light/green glowing overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.04),transparent_50%)]" />
            
            {/* Ambient Micro Grids & Scanlines for Technical Elevation */}
            <div className="absolute inset-0 live-grid opacity-30 mix-blend-overlay" />
            
            {/* Live oscillating real designer workspace background */}
            <motion.div 
              animate={{
                scale: [1, 1.03, 1],
                rotate: [0, 0.5, 0, -0.5, 0]
              }}
              transition={{
                duration: 45,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 live-designer-bg pointer-events-none" 
            />

            <div className="absolute inset-0 live-dot-matrix opacity-25 mix-blend-screen" />
            <div className="absolute inset-0 live-coordinate-axes opacity-20 pointer-events-none" />
            <div className="absolute inset-0 scanline-sweep pointer-events-none" />
            <div className="absolute inset-0 interactive-mouse-glow mix-blend-screen pointer-events-none" />

            {/* Float-up Star Dust Particles */}
            {ambientParticles.map((pt) => (
              <motion.div
                key={pt.id}
                className="absolute rounded-full bg-brand-gold/15 mix-blend-screen pointer-events-none"
                style={{
                  width: pt.size,
                  height: pt.size,
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                }}
                animate={{
                  y: [0, -700],
                  opacity: [0, 0.7, 0.7, 0],
                }}
                transition={{
                  duration: pt.duration,
                  repeat: Infinity,
                  delay: pt.delay,
                  ease: "linear",
                }}
              />
            ))}
            
            {/* 1. Sky Blue Glowing Orb */}
            <motion.div 
              animate={settings?.theme?.enableGlowAnimation ? {
                y: [0, -25, 0],
                x: [0, 15, 0],
              } : {}}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              style={{ opacity: (settings?.theme?.skyBlueIntensity || 15) / 100 }}
              className="absolute top-[5%] left-[5%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-[#38bdf8] blur-[160px] mix-blend-screen transition-opacity duration-1000" 
            />
            
            {/* 2. Pure White Core Accent */}
            <div className="absolute top-[20%] right-[15%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-white/5 blur-[130px] mix-blend-screen" />
            
            {/* 3. Lush Green Glowing Orb */}
            <motion.div 
              animate={settings?.theme?.enableGlowAnimation ? {
                y: [0, 20, 0],
                x: [0, -15, 0],
              } : {}}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              style={{ opacity: (settings?.theme?.emeraldGreenIntensity || 15) / 100 }}
              className="absolute bottom-[25%] left-[8%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-emerald-500 transition-opacity duration-1000 blur-[170px] mix-blend-screen" 
            />
            
            {/* 4. Soft White-Yellow Highlight Orb */}
            <motion.div 
              animate={settings?.theme?.enableGlowAnimation ? {
                y: [0, -20, 0],
                x: [0, -10, 0],
              } : {}}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{ opacity: (settings?.theme?.amberYellowIntensity || 15) / 100 }}
              className="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-amber-200 transition-opacity duration-1000 blur-[150px] mix-blend-screen" 
            />
          </div>

          {/* Side Labels */}
          <div className="fixed top-1/2 -left-12 -translate-y-1/2 rotate-90 hidden lg:flex side-label z-10">
            <span className="w-12 h-[1px] bg-white/20"></span>
            Digital Excellence
            <span className="w-12 h-[1px] bg-white/20"></span>
          </div>
          <div className="fixed top-1/2 -right-12 -translate-y-1/2 -rotate-90 hidden lg:flex side-label z-10">
            <span className="w-12 h-[1px] bg-white/20"></span>
            Kigali — Rwanda
            <span className="w-12 h-[1px] bg-white/20"></span>
          </div>

          <Routes>
            {/* Main App Layout */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/books" element={<BooksPage />} />
                  </Routes>
                  <Footer />
                  <WhatsAppButton />
                  <AIChatbot />
                </>
              }
            />

            {/* Admin Routes (No Global Navbar/Footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

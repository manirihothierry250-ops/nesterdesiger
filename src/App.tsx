/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, ScrollRestoration } from 'react-router-dom';
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

// Scroll to top on route change component for React Router
function ScrollToTop() {
  const { pathname } = window.location;
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-brand-black selection:bg-brand-gold selection:text-brand-black relative overflow-hidden">
          
          {/* Website Main Dynamic Background (Sky Blue, White, Green, and White-Yellow theme) */}
          <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-slate-950">
            {/* Subtle light/green glowing overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06),transparent_50%)]" />
            
            {/* 1. Sky Blue Glowing Orb */}
            <div className="absolute top-[5%] left-[5%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-[#38bdf8]/15 blur-[160px] mix-blend-screen opacity-85" />
            
            {/* 2. Pure White Core Accent */}
            <div className="absolute top-[20%] right-[15%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-white/10 blur-[130px] mix-blend-screen opacity-90" />
            
            {/* 3. Lush Green Glowing Orb */}
            <div className="absolute bottom-[25%] left-[8%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-emerald-500/15 blur-[170px] mix-blend-screen opacity-80" />
            
            {/* 4. Soft White-Yellow Highlight Orb */}
            <div className="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-amber-200/15 blur-[150px] mix-blend-screen opacity-85" />

            {/* Supplementary subtle gradients for ultimate smoothness */}
            <div className="absolute top-[40%] left-[40%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] rounded-full bg-sky-400/10 blur-[140px] mix-blend-screen opacity-60" />
            <div className="absolute bottom-[40%] right-[25%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-yellow-100/10 blur-[130px] mix-blend-screen opacity-70" />
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

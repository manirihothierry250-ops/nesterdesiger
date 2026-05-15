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
import { GalleryPage } from './pages/GalleryPage';
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
        <div className="min-h-screen bg-brand-black selection:bg-brand-gold selection:text-brand-black relative">
          
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
                    <Route path="/gallery" element={<GalleryPage />} />
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

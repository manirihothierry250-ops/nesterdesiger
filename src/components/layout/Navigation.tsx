import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Music2, ArrowLeft, RotateCw } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useWebsiteSettings } from '../../hooks/useWebsiteSettings';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Books', href: '/books' },
  { name: 'Contact', href: '/#contact' },
];

import { SOCIAL_LINKS } from '../../constants';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'py-4 backdrop-blur-xl bg-black/40 border-b border-white/10' : 'py-6 bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/profile.png" alt="Nesta Design" className="w-10 h-10 rounded-lg object-cover" />
            <span className="font-heading font-bold text-xl md:text-2xl tracking-tighter uppercase whitespace-nowrap">
              NESTA<span className="text-brand-gold">DESIGN</span>
            </span>
          </Link>

          {/* Navigation Controls: Back & Reload */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-1.5 py-1 backdrop-blur-md">
            <button
              onClick={() => navigate(-1)}
              title="Go Back"
              className="p-1.5 text-slate-400 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center"
              id="global-back-button"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="w-[1px] h-4 bg-white/10 mx-1" />
            <button
              onClick={() => window.location.reload()}
              title="Reload Page"
              className="p-1.5 text-slate-400 hover:text-brand-gold hover:bg-white/5 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center"
              id="global-reload-button"
            >
              <RotateCw size={14} className="hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                'text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:text-brand-gold',
                location.pathname === link.href ? 'text-brand-gold scale-110' : 'text-slate-300'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 backdrop-blur-2xl bg-black/90 border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col p-8 gap-6 justify-center items-center text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold uppercase tracking-[0.2em] text-slate-200 hover:text-brand-gold"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/#contact"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-brand-gold text-brand-black text-center rounded-xl font-black uppercase tracking-widest text-sm"
              >
                Request Service
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  const { settings } = useWebsiteSettings();
  
  return (
    <footer className="relative z-10 bg-black/40 border-t border-white/5 pt-20 pb-12 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 px-6 lg:px-0">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src="/profile.png" alt="Nesta Design" className="w-8 h-8 rounded object-cover" />
              <span className="font-heading font-bold text-xl uppercase tracking-tighter">
                {settings?.company?.companyName || 'NESTA'}<span className="text-brand-gold">DESIGN</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-light font-sans">
              Crafting digital excellence with robust solutions. Inspired by innovation, committed to delivering first-class creative experiences.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={Facebook} href={SOCIAL_LINKS.Facebook} />
              <SocialIcon icon={Instagram} href={SOCIAL_LINKS.Instagram} />
              <SocialIcon icon={Twitter} href={SOCIAL_LINKS.Twitter} />
              <SocialIcon icon={Linkedin} href={SOCIAL_LINKS.Linkedin} />
              <SocialIcon icon={Youtube} href={SOCIAL_LINKS.Youtube} />
              <SocialIcon icon={Music2} href={SOCIAL_LINKS.Tiktok} />
            </div>
          </div>

          <div>
             <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-6">Explore</p>
             <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
               <li><Link to="/" className="text-slate-400 hover:text-brand-gold transition-colors">Home</Link></li>
               <li><Link to="/about" className="text-slate-400 hover:text-brand-gold transition-colors">About</Link></li>
               <li><Link to="/services" className="text-slate-400 hover:text-brand-gold transition-colors">Services</Link></li>
               <li><Link to="/gallery" className="text-slate-400 hover:text-brand-gold transition-colors">Portfolio</Link></li>
               <li><Link to="/books" className="text-slate-400 hover:text-brand-gold transition-colors">Books</Link></li>
               <li><Link to="/#contact" className="text-slate-400 hover:text-brand-gold transition-colors">Contact</Link></li>
             </ul>
          </div>

          <div>
             <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-6">Contact Info</p>
             <ul className="space-y-6">
                <FooterInfo label="Phone" value={settings?.contact?.phone || '+250 782 739 381'} />
                <FooterInfo label="Email" value={settings?.contact?.email || 'jeanesta81@gmail.com'} />
                <FooterInfo label="Studio" value={`${settings?.contact?.addressText || 'Kigali'} — ${settings?.contact?.cityCountry || 'Rwanda'}`} />
             </ul>
          </div>

          <div>
             <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-6">Our Mission</p>
             <p className="text-xs font-medium italic text-slate-400 leading-loose">
               "To be the ICT Company of choice by providing quality service and timely solutions through professional delivery."
             </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 px-6 lg:px-0">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} {settings?.company?.companyName || 'Nesta Design'} — All Rights Reserved
          </p>
          <div className="flex gap-8 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
             <Link to="/login" className="hover:text-brand-gold transition-colors">Admin Login</Link>
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterInfo({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white tracking-tight">{value}</p>
    </div>
  );
}

function SocialIcon({ icon: Icon, href }: { icon: any, href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
    >
      <Icon size={16} />
    </a>
  );
}

export function WhatsAppButton() {
  const { settings } = useWebsiteSettings();
  const rawNum = settings?.contact?.whatsappNumber || '+250782739381';
  const cleanNum = rawNum.replace(/[^0-9]/g, '');

  return (
    <a
      href={`https://wa.me/${cleanNum}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 shadow-green-500/20"
    >
      <MessageCircle size={28} />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-green-500"></span>
      </span>
    </a>
  );
}

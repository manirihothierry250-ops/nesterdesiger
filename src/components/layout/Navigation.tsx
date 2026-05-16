import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-amber-600 to-yellow-200 rounded-lg flex items-center justify-center font-black text-brand-black text-xl shadow-lg shadow-amber-500/20">
            N
          </div>
          <span className="font-heading font-bold text-2xl tracking-tighter uppercase whitespace-nowrap">
            NESTA<span className="text-brand-gold">DESIGN</span>
          </span>
        </Link>

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
  return (
    <footer className="relative z-10 bg-black/40 border-t border-white/5 pt-20 pb-12 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 px-6 lg:px-0">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-gold rounded flex items-center justify-center font-bold text-brand-black">
                N
              </div>
              <span className="font-heading font-bold text-xl uppercase tracking-tighter">
                NESTA<span className="text-brand-gold">DESIGN</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Crafting digital excellence in Kigali since 2020. Our mission is to be the ICT company of choice by providing quality service and timely solutions.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Linkedin} />
              <SocialIcon icon={Youtube} />
            </div>
          </div>

          <div>
             <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-6">Explore</p>
             <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
               <li><Link to="/" className="text-slate-400 hover:text-brand-gold transition-colors">Home</Link></li>
               <li><Link to="/about" className="text-slate-400 hover:text-brand-gold transition-colors">About</Link></li>
               <li><Link to="/services" className="text-slate-400 hover:text-brand-gold transition-colors">Services</Link></li>
               <li><Link to="/gallery" className="text-slate-400 hover:text-brand-gold transition-colors">Portfolio</Link></li>
               <li><Link to="/#contact" className="text-slate-400 hover:text-brand-gold transition-colors">Contact</Link></li>
             </ul>
          </div>

          <div>
             <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-6">Contact Info</p>
             <ul className="space-y-6">
                <FooterInfo label="Phone" value="+250 782 739 381" />
                <FooterInfo label="Email" value="jeanesta81@gmail.com" />
                <FooterInfo label="Studio" value="Kigali – Rwanda" />
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
            © {new Date().getFullYear()} Nesta Design — All Rights Reserved
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

function SocialIcon({ icon: Icon }: { icon: any }) {
  return (
    <a
      href="#"
      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-black transition-all duration-300"
    >
      <Icon size={16} />
    </a>
  );
}

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/250782739381"
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

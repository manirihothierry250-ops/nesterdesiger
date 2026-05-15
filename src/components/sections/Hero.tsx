import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Cinematic Background Simulation */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://picsum.photos/seed/nesta-hero/1920/1080?brightness=0.6"
          alt="Premium Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/40 via-brand-black/80 to-brand-black"></div>
        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-amber-600/10 to-transparent"></div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-tighter">Creative ICT Solutions</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-heading font-black leading-[0.9] tracking-tight uppercase">
              WELCOME TO <br/>
              <span className="text-gradient">Nesta Design</span>
            </h1>
            
            <p className="text-slate-300 text-lg md:text-xl font-light max-w-lg leading-relaxed">
              Professional Graphic Design, Website & App Development, Branding, Photography, and Creative Media Services for modern businesses.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <Link
                to="/#request"
                className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-brand-gold text-black font-bold rounded-xl shadow-xl shadow-amber-600/20 flex items-center gap-2 hover:scale-[1.02] transition-all"
              >
                REQUEST SERVICE
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/gallery"
                className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-xl text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
              >
                VIEW PORTFOLIO
                <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Hero Side Grid */}
          <div className="lg:col-span-5 hidden lg:grid grid-cols-2 gap-4 h-fit">
             <HeroCard title="Web Development" desc="Enterprise-grade websites & apps." delay={0.2} />
             <HeroCard title="Branding" desc="Corporate identity & logo engineering." delay={0.3} className="mt-8" />
             <HeroCard title="Media Services" desc="Cinematic photo & video production." delay={0.4} />
             <HeroCard title="ICT Consultancy" desc="Digital transformation strategy." delay={0.5} className="mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCard({ title, desc, delay, className }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl flex flex-col gap-3 group hover:border-brand-gold/50 transition-all",
        className
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-brand-gold/20 flex items-center justify-center text-brand-gold">
        <Sparkles size={20} />
      </div>
      <h3 className="font-bold text-sm tracking-tight">{title}</h3>
      <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
    </motion.div>
  );
}

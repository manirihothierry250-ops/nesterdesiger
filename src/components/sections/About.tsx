import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Sparkles, Handshake, ShieldCheck, Heart } from 'lucide-react';

const values = [
  { title: 'Creativity', icon: Sparkles, color: 'bg-orange-500/10 text-orange-500' },
  { title: 'Cooperation', icon: Handshake, color: 'bg-blue-500/10 text-blue-500' },
  { title: 'Commitment', icon: ShieldCheck, color: 'bg-green-500/10 text-green-500' },
  { title: 'Satisfaction', icon: Heart, color: 'bg-red-500/10 text-red-500' },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-[#050505]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-10 leading-tight">
              Crafting Excellence <br />
              <span className="text-brand-gold">One Pixel at a Time</span>
            </h2>
            
            {/* Founder Profile / CEO Message */}
            <div className="mb-12 glass p-8 rounded-3xl border-l-4 border-brand-gold relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <p className="text-slate-300 text-lg leading-relaxed italic mb-8 relative z-10">
                “I am so grateful that you have taken the time to consider partnering with Nesta Design to serve you. While we are proud of our work and the results we will help you achieve, it is the relationships we build that will endure. I look forward to working closely with you and your team.”
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border border-brand-gold overflow-hidden">
                  <img 
                    src="/profile.png" 
                    alt="Jean Nesta" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Jean Nesta</h4>
                  <p className="text-brand-gold text-xs font-bold uppercase tracking-widest">Founder & CEO</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                To be the ICT Company of choice by providing quality service and timely solutions through professional delivery of services.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-2xl">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-brand-gold mb-4">
                  <Target size={24} />
                </div>
                <h4 className="font-bold text-xl mb-2">Mission</h4>
                <p className="text-slate-400 text-sm">To provide quality information communications technology services through timely solutions.</p>
              </div>
              <div className="glass p-8 rounded-2xl">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-brand-gold mb-4">
                  <Eye size={24} />
                </div>
                <h4 className="font-bold text-xl mb-2">Vision</h4>
                <p className="text-slate-400 text-sm">To be the company of choice in the provision of quality ICT services and timely solutions.</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4 hover:border-brand-gold/20 transition-all"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${value.color}`}>
                  <value.icon size={32} />
                </div>
                <h4 className="font-bold text-lg">{value.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

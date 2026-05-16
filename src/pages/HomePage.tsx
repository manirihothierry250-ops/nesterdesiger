import React from 'react';
import { Hero } from '../components/sections/Hero';
import { ServiceRequestForm } from '../components/sections/ServiceRequestForm';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, ExternalLink, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatePresence } from 'framer-motion';

export function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <FounderSection />

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-brand-black">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-heading font-black mb-4">Let's <span className="text-brand-gold">Connect</span></h2>
              <p className="text-slate-400">Choose how you'd like to reach us below.</p>
            </div>

            <ContactTabs />
          </div>
        </div>
      </section>
    </main>
  );
}

function FounderSection() {
  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden glass p-2">
              <div className="w-full h-full bg-white/10 rounded-2xl overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-700">
                <img
                  src="/profile.png"
                  alt="Jean Nesta"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-black uppercase text-white font-heading">Jean Nesta</h3>
                  <p className="text-brand-gold font-bold uppercase tracking-widest text-xs">Founder & CEO</p>
                </div>
              </div>
            </div>
            {/* Visual Deco */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-gold/20 rounded-full blur-2xl"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-block px-4 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black uppercase tracking-[0.2em]">
              The Visionary
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-black leading-none">
              Leading With <br />
              <span className="text-gradient uppercase">Passion & Vision</span>
            </h2>
            <div className="glass p-6 rounded-2xl border-l-4 border-brand-gold italic text-slate-300 text-sm">
              “I am so grateful that you have taken the time to consider partnering with Nesta Design to serve you. While we are proud of our work and the results we will help you achieve... it is the relationships we build that will endure. I look forward to working closely with you and your team.”
            </div>
            <p className="text-slate-400 text-lg leading-relaxed font-light">
              With over a decade of experience in the ICT industry, Jean Nesta leads a team of creatives and engineers at Nesta Design. Our focus is on bridging the gap between business goals and innovative digital solutions.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-3xl font-black text-white">10+</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Years Experience</p>
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-black text-white">500+</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Projects Led</p>
              </div>
            </div>
            <div className="pt-6">
              <a 
                href="mailto:jeanesta81@gmail.com"
                className="inline-flex items-center gap-3 text-brand-gold font-black uppercase tracking-[0.2em] group text-sm"
              >
                Connect with the Founder
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactTabs() {
  const [activeTab, setActiveTab] = React.useState<'info' | 'service'>('service');

  return (
    <div>
      <div className="flex justify-center mb-12">
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10">
          <button
            onClick={() => setActiveTab('info')}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'info' ? "bg-brand-gold text-brand-black" : "text-slate-400 hover:text-white"
            )}
          >
            Contact Info
          </button>
          <button
            onClick={() => setActiveTab('service')}
            className={cn(
              "px-8 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === 'service' ? "bg-brand-gold text-brand-black" : "text-slate-400 hover:text-white"
            )}
          >
            Request Service
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'info' ? (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-8">
              <ContactInfo icon={Phone} label="Call Us" value="+250 782 739 381" href="tel:+250782739381" />
              <ContactInfo icon={Mail} label="Email Us" value="jeanesta81@gmail.com" href="mailto:jeanesta81@gmail.com" />
              <ContactInfo icon={MapPin} label="Visit Us" value="Kigali – Rwanda" href="#" />
              
              <div className="pt-8">
                <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-slate-500">Follow Us</h4>
                <div className="flex flex-wrap gap-4">
                  {['Facebook', 'Instagram', 'Twitter', 'Linkedin', 'Youtube'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="px-6 py-3 glass rounded-xl text-sm font-medium hover:bg-brand-gold hover:text-brand-black transition-all flex items-center gap-2"
                    >
                      {social} <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="aspect-square rounded-3xl overflow-hidden glass p-2">
              <div className="w-full h-full bg-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={64} className="mx-auto mb-6 text-brand-gold opacity-50" />
                  <p className="text-2xl font-black uppercase font-heading tracking-widest">Kigali, Rwanda</p>
                  <p className="text-slate-500">Our Innovative Hub</p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="service"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto"
          >
            <ServiceRequestForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactInfo({ icon: Icon, label, value, href }: { icon: any, label: string, value: string, href: string }) {
  return (
    <a href={href} className="flex gap-6 group">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-black transition-all">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-bold group-hover:text-brand-gold transition-colors">{value}</p>
      </div>
    </a>
  );
}

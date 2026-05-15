import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Globe, Smartphone, Monitor, Briefcase, Camera, Video, Printer, Send, Search, Layout } from 'lucide-react';
import { useServices } from '../../hooks/useServices';
import { cn } from '../../lib/utils';

const iconMap: Record<string, any> = {
  Palette, Globe, Smartphone, Monitor, Briefcase, Camera, Video, Printer, Send, Search, Layout
};

const defaultServices = [
  { title: 'Graphic Design', icon: 'Palette', description: 'Visual storytelling through professional graphic design.' },
  { title: 'Website Development', icon: 'Globe', description: 'Modern, responsive, and high-performance websites.' },
  { title: 'Mobile Apps', icon: 'Smartphone', description: 'Custom iOS and Android applications development.' },
  { title: 'Branding', icon: 'Briefcase', description: 'Comprehensive corporate identity and branding solutions.' },
  { title: 'Photography', icon: 'Camera', description: 'Professional commercial and creative photography.' },
  { title: 'Videography', icon: 'Video', description: 'High-quality video production and editing services.' },
  { title: 'Digital Marketing', icon: 'Send', description: 'Growth-focused digital marketing strategies.' },
  { title: 'UI/UX Design', icon: 'Layout', description: 'User-centric interface and experience design.' },
];

export function Services() {
  const { services, loading } = useServices();
  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-24 bg-brand-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-black mb-6"> Our <span className="text-brand-gold">Expertise</span> </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              We provide a wide range of ICT services designed to help your business grow in the digital age.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: any, index: number }) {
  const Icon = iconMap[service.icon] || Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="glass p-8 rounded-2xl group transition-all duration-300 hover:border-brand-gold/30"
    >
      <div className="w-14 h-14 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold mb-6 group-hover:bg-brand-gold group-hover:text-brand-black transition-colors">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold mb-4">{service.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        {service.description}
      </p>
      <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
        Learn More <Search size={14} />
      </div>
    </motion.div>
  );
}

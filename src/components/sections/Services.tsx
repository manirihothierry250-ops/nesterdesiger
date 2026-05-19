import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Globe, Smartphone, Monitor, Briefcase, Camera, Video, Printer, Send, Search, Layout, Image as ImageIcon, Contact, CreditCard, Maximize, Shirt, Stamp, Mail, Box } from 'lucide-react';
import { useServices } from '../../hooks/useServices';
import { cn } from '../../lib/utils';
import { ServiceApplicationModal } from './ServiceApplicationModal';

const iconMap: Record<string, any> = {
  Palette, Globe, Smartphone, Monitor, Briefcase, Camera, Video, Printer, Send, Search, Layout, ImageIcon, Contact, CreditCard, Maximize, Shirt, Stamp, Mail, Box
};

const defaultServices = [
  { 
    title: 'Graphic Design', 
    icon: 'Palette', 
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    description: 'Visual storytelling through professional graphic design and creative illustration.' 
  },
  { 
    title: 'Publishing Services', 
    icon: 'Layout', 
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    description: 'Professional typesetting, book design, and digital publishing solutions.' 
  },
  { 
    title: 'Printing Services', 
    icon: 'Printer', 
    image: 'https://images.unsplash.com/photo-1563206767-5b18f218e7de?auto=format&fit=crop&q=80&w=800',
    description: 'High-quality digital and offset printing for all your business needs.' 
  },
  { 
    title: 'Album Design', 
    icon: 'ImageIcon', 
    image: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&q=80&w=800',
    description: 'Custom photo album design for weddings, events, and family memories.' 
  },
  { 
    title: 'ID Card Design', 
    icon: 'Contact', 
    image: 'https://images.unsplash.com/photo-1614064641935-2479e0066ee7?auto=format&fit=crop&q=80&w=800',
    description: 'Identification card design and printing for schools and organizations.' 
  },
  { 
    title: 'Business Card Design', 
    icon: 'CreditCard', 
    image: 'https://images.unsplash.com/photo-1589330694653-93d3b764b88a?auto=format&fit=crop&q=80&w=800',
    description: 'Professional business cards that make a lasting first impression.' 
  },
  { 
    title: 'Banner Printing', 
    icon: 'Maximize', 
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=800',
    description: 'Large format banner printing for events, promotions, and outdoors.' 
  },
  { 
    title: 'T-shirt Printing', 
    icon: 'Shirt', 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    description: 'Custom t-shirt printing for branding, groups, and special events.' 
  },
  { 
    title: 'Sticker Design', 
    icon: 'Stamp', 
    image: 'https://images.unsplash.com/photo-1572375924201-4927cb069ea5?auto=format&fit=crop&q=80&w=800',
    description: 'Creative sticker design and printing for products and branding.' 
  },
  { 
    title: 'Invitation Card Design', 
    icon: 'Mail', 
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    description: 'Elegant invitation cards for weddings, parties, and corporate events.' 
  },
  { 
    title: 'Packaging Design', 
    icon: 'Box', 
    image: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=800',
    description: 'Innovative packaging design that enhances your brand appeal.' 
  },
];

export function Services() {
  const { services, loading: servicesLoading } = useServices();
  const displayServices = services.length > 0 ? services : defaultServices;
  const [selectedService, setSelectedService] = useState<string | null>(null);

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
            <ServiceCard 
              key={service.title} 
              service={service} 
              index={index} 
              onApply={() => setSelectedService(service.title)}
            />
          ))}
        </div>
      </div>

      <ServiceApplicationModal 
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        serviceTitle={selectedService || ''}
      />
    </section>
  );
}

function ServiceCard({ service, index, onApply }: { service: any, index: number, onApply: () => void }) {
  const Icon = iconMap[service.icon] || Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onClick={onApply}
      className="glass rounded-2xl overflow-hidden group transition-all duration-300 hover:border-brand-gold/30 cursor-pointer"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={service.imageUrl || service.image || "https://picsum.photos/seed/nesta/800/600"} 
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center text-brand-black shadow-lg">
          <Icon size={24} />
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3">{service.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {service.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
            Apply Now <Send size={14} />
          </div>
          <Search size={14} className="text-slate-600 group-hover:text-brand-gold transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}

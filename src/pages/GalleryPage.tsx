import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Share2, X } from 'lucide-react';
import { useGallery, GalleryItem } from '../hooks/useGallery';

export function GalleryPage() {
  const { items, loading } = useGallery();
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];
  const filteredItems = filter === 'All' ? items : items.filter(item => item.category === filter);

  return (
    <main className="pt-32 pb-24 bg-brand-black min-h-screen">
      <div className="container mx-auto px-6 text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black mb-6">Our <span className="text-brand-gold">Portfolio</span></h1>
        <p className="text-slate-400 max-w-2xl mx-auto mb-10">
          Explore our collection of posters, designs, and photographic masterpieces created for our amazing clients.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat ? 'bg-brand-gold text-brand-black' : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6">
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading gallery...</div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <p className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-1">{item.category}</p>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <div className="flex gap-4 mt-4">
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-brand-gold hover:text-brand-black transition-colors">
                        <Maximize2 size={18} />
                      </button>
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-brand-gold hover:text-brand-black transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-black/95 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-brand-gold transition-colors">
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-w-full max-h-full rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

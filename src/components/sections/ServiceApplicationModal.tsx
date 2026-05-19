import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Phone, Mail, MapPin, Briefcase, Calendar, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';

interface ServiceApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle: string;
}

export function ServiceApplicationModal({ isOpen, onClose, serviceTitle }: ServiceApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    projectType: 'Business',
    description: '',
    deadline: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'requests'), {
        ...formData,
        serviceNeeded: serviceTitle,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // Prepare WhatsApp message
      const whatsappMsg = `Hello Nesta Design,%0A%0A*New Service Request*%0A*Name:* ${formData.fullName}%0A*Email:* ${formData.email || 'N/A'}%0A*Phone:* ${formData.phone}%0A*Location:* ${formData.location || 'N/A'}%0A*Service:* ${serviceTitle}%0A*Deadline:* ${formData.deadline || 'N/A'}%0A%0A*Explanation:* ${formData.description}`;
      window.open(`https://wa.me/250782739381?text=${whatsappMsg}`, '_blank');

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          location: '',
          projectType: 'Business',
          description: '',
          deadline: '',
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-brand-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-brand-gold/5 to-transparent">
              <div>
                <h2 className="text-2xl font-black font-heading mb-1">Apply for <span className="text-brand-gold">{serviceTitle}</span></h2>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Project Request Form</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Request Sent!</h3>
                  <p className="text-slate-400">Thank you for choosing Nesta Design. We'll get back to you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                        placeholder="+250 780 000 000"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                        placeholder="Kigali, Rwanda"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Project Type</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <select 
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold transition-colors text-sm appearance-none"
                      >
                        <option value="Business">Business / Corporate</option>
                        <option value="Personal">Personal project</option>
                        <option value="NGO">Non-Profit / NGO</option>
                        <option value="Startup">Startup</option>
                      </select>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Expected Deadline</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold transition-colors text-sm"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Project Description</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-slate-500" size={16} />
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-gold transition-colors text-sm resize-none"
                        placeholder="Tell us more about what you need..."
                      />
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="md:col-span-2 mt-4 py-4 bg-brand-gold text-brand-black rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    {loading ? 'Submitting...' : 'Send Request'}
                  </button>
                  <p className="md:col-span-2 text-center text-slate-600 text-[10px] mt-2 flex items-center justify-center gap-2 italic">
                    <MessageSquare size={12} /> This will also open WhatsApp to start a direct conversation.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

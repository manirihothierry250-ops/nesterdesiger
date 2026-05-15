import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { cn } from '../../lib/utils';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is too short'),
  phone: z.string().min(10, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  location: z.string().min(2, 'Location is required'),
  serviceNeeded: z.string().min(1, 'Please select a service'),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  description: z.string().min(10, 'Please provide more details'),
});

type FormValues = z.infer<typeof formSchema>;

const services_list = [
  'Graphic Design', 'Website Development', 'Mobile Apps', 'Software Development',
  'Branding', 'Photography', 'Videography', 'Digital Marketing', 'Printing Services'
];

export function ServiceRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'requests'), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // Prepare WhatsApp message
      const whatsappMsg = `Hello Nesta Design, I am ${data.fullName}. I need ${data.serviceNeeded} service. %0A%0ADetails: ${data.description}`;
      window.open(`https://wa.me/250782739381?text=${whatsappMsg}`, '_blank');

      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="request" className="py-24 bg-brand-black border-y border-white/5">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-black mb-4">Request a <span className="text-brand-gold">Service</span></h2>
          <p className="text-slate-400">Fill out the form below and we will get back to you within 24 hours.</p>
        </div>

        <div className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <AnimatePresence>
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Request Sent!</h3>
                <p className="text-slate-400 mb-8 max-w-sm">
                  Thank you for reaching out to Nesta Design. We have received your request and redirected you to WhatsApp.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all font-bold"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" error={errors.fullName?.message}>
                  <input {...register('fullName')} className={inputClass} placeholder="John Doe" />
                </InputGroup>

                <InputGroup label="Phone Number" error={errors.phone?.message}>
                  <input {...register('phone')} className={inputClass} placeholder="+250 782 ..." />
                </InputGroup>

                <InputGroup label="Email Address" error={errors.email?.message}>
                  <input {...register('email')} className={inputClass} placeholder="john@example.com" />
                </InputGroup>

                <InputGroup label="Location" error={errors.location?.message}>
                  <input {...register('location')} className={inputClass} placeholder="Kigali, Rwanda" />
                </InputGroup>

                <InputGroup label="Service Needed" error={errors.serviceNeeded?.message}>
                  <select {...register('serviceNeeded')} className={inputClass}>
                    <option value="">Select a service</option>
                    {services_list.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </InputGroup>

                <InputGroup label="Project Type" error={errors.projectType?.message}>
                  <input {...register('projectType')} className={inputClass} placeholder="e.g. Corporate Website" />
                </InputGroup>

                <InputGroup label="Budget Range" error={errors.budget?.message}>
                  <input {...register('budget')} className={inputClass} placeholder="e.g. $500 - $1000" />
                </InputGroup>

                <InputGroup label="Deadline" error={errors.deadline?.message}>
                  <input {...register('deadline')} type="date" className={inputClass} />
                </InputGroup>

                <div className="md:col-span-2">
                  <InputGroup label="Project Description" error={errors.description?.message}>
                    <textarea {...register('description')} rows={4} className={inputClass} placeholder="Tell us more about your project..." />
                  </InputGroup>
                </div>

                <div className="md:col-span-2 mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-brand-gold text-brand-black rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                  <p className="text-center text-slate-500 text-xs mt-4 flex items-center justify-center gap-2">
                    <MessageSquare size={14} /> This will also open WhatsApp to start a direct conversation.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function InputGroup({ label, children, error }: { label: string, children: React.ReactNode, error?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all text-sm";

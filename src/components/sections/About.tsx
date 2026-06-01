import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  ExternalLink, 
  Briefcase, 
  Calendar, 
  Flame, 
  BookOpen, 
  Music, 
  Compass, 
  Mic 
} from 'lucide-react';

const coreValues = [
  { 
    title: 'Integrity', 
    desc: 'Standing for the truth and doing what is right.',
    icon: ShieldCheck, 
    color: 'bg-green-500/10 text-green-500' 
  },
  { 
    title: 'Hard Work & Dedication', 
    desc: 'Working with energy, resilience, and commitment.',
    icon: Flame, 
    color: 'bg-orange-500/10 text-orange-500' 
  },
  { 
    title: 'Compassion & Kindness', 
    desc: 'Supporting others and fostering a collaborative spirit.',
    icon: Heart, 
    color: 'bg-red-500/10 text-red-500' 
  },
  { 
    title: 'Continuous Growth & Learning', 
    desc: 'Embracing daily learning and self-improvement.',
    icon: BookOpen, 
    color: 'bg-blue-500/10 text-blue-500' 
  },
];

const skills = [
  { name: 'Graphic Design', level: '100%' },
  { name: 'Adobe Photoshop', level: '95%' },
  { name: 'Adobe Illustrator', level: '90%' },
  { name: 'Proshow', level: '85%' },
  { name: 'Microsoft Office Suite', level: '90%' },
  { name: 'Driving License (Category B)', level: '100%' },
];

const hobbies = [
  { name: 'Music', icon: Music },
  { name: 'Travel', icon: Compass },
  { name: 'Podcasting', icon: Mic },
  { name: 'Writing / Book Authoring', icon: BookOpen },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-[#050505]/75 backdrop-blur-md text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Visual Profile & Quick Details */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-[2.5rem] overflow-hidden glass p-3 border border-white/10 group">
              <div className="w-full h-full rounded-[2rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <img 
                  src="/profile.png" 
                  alt="HITIMANA JEAN" 
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/hitimana-jean/1000/1250";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl font-black font-heading uppercase text-white tracking-widest">HITIMANA JEAN</h3>
                <p className="text-brand-gold font-bold uppercase tracking-widest text-xs mt-1">Founder of NESTADESIGN</p>
                
                <div className="flex items-center gap-2 mt-3 text-slate-300 text-xs font-semibold">
                  <MapPin size={14} className="text-brand-gold shrink-0" />
                  <span>Shyorongi – Rulindo</span>
                </div>
              </div>
            </div>

            {/* Behance Link */}
            <a 
              href="https://www.behance.net/Nestadesign1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-white/5 border border-white/10 hover:border-brand-gold/40 hover:bg-white/10 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Behance Portfolio</p>
                  <p className="text-sm font-bold text-white group-hover:text-brand-gold transition-colors">Nestadesign1</p>
                </div>
              </div>
              <ExternalLink size={16} className="text-slate-500 group-hover:text-brand-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>

            {/* Hobbies Badges */}
            <div className="glass p-6 rounded-3xl border border-white/5">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Interests & Hobbies</h4>
              <div className="grid grid-cols-2 gap-3">
                {hobbies.map((hobby) => (
                  <div key={hobby.name} className="flex items-center gap-2.5 bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors">
                    <hobby.icon size={15} className="text-brand-gold shrink-0" />
                    <span className="text-xs font-medium text-slate-300">{hobby.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio, Skills & Experience */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 space-y-10"
          >
            <div>
              <div className="inline-block px-4 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                About Founder
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-black mb-6 leading-tight uppercase">
                ABOUT <span className="text-brand-gold">ME</span>
              </h2>
              <div className="space-y-6">
                <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
                  I am a professional Graphic Designer with extensive experience in creating diverse visual designs that help companies and individuals communicate their messages effectively and beautifully. I am highly skilled in industry-standard software such as Adobe Photoshop, Illustrator, and others. I am passionate about innovation and dedicated to delivering high-quality solutions tailored to client needs.
                </p>
                <div className="bg-gradient-to-r from-amber-600/5 to-yellow-600/5 border border-amber-500/10 p-5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-xl pointer-events-none"></div>
                  <p className="font-handwriting text-2xl text-amber-200/90 leading-tight">
                    "Every pixel holds a purpose, and every layout tells a story. At Nesta Design, we don't just craft graphics or code applications; we build visual experiences that resonate."
                  </p>
                  <p className="text-right font-handwriting text-xl text-brand-gold mt-2">— Hitimana Jean</p>
                </div>
              </div>
            </div>

            {/* Skills Progress Bars */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Technical Skills & Expertise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="glass p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-200">{skill.name}</span>
                      <span className="text-[10px] font-mono font-bold text-brand-gold">{skill.level}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: skill.level }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="bg-brand-gold h-full rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Experience</h3>
              <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Graphic Designer</h4>
                      <p className="text-[10px] font-semibold uppercase text-brand-gold tracking-widest mt-0.5">Nesta Design</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium py-1 px-3 bg-white/5 rounded-lg border border-white/5 w-fit">
                    <Calendar size={14} className="text-brand-gold" />
                    <span>2005 – Present</span>
                  </div>
                </div>

                <ul className="space-y-3.5 pt-2">
                  <li className="flex gap-3 text-sm text-slate-300 leading-relaxed items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-2"></div>
                    <span>Proven track record of success, backed by strong testimonials from various individuals and organizations I have collaborated with over the years.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-slate-300 leading-relaxed items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-2"></div>
                    <span>Delivered high-quality, impactful visual concepts tailored to diverse client needs.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values Section */}
        <div className="mt-24 pt-16 border-t border-white/5">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-brand-gold font-black uppercase text-[10px] tracking-[0.3em] mb-4">Integrity & Excellence</h3>
            <h2 className="text-3xl md:text-5xl font-black font-heading uppercase leading-none">CORE VALUES</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass p-8 rounded-3xl flex flex-col gap-5 hover:border-brand-gold/20 transition-all border border-white/5"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${value.color}`}>
                  <value.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 text-white">{value.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-brand-gold mb-4 group-hover:bg-brand-gold/15 transition-all">
              <Target size={24} />
            </div>
            <h4 className="font-bold text-xl mb-2">Our Mission</h4>
            <p className="text-slate-400 text-sm leading-relaxed">To provide quality information communications technology services through timely solutions and professional visual concept deliveries.</p>
          </div>
          <div className="glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-brand-gold mb-4 group-hover:bg-brand-gold/15 transition-all">
              <Eye size={24} />
            </div>
            <h4 className="font-bold text-xl mb-2">Our Vision</h4>
            <p className="text-slate-400 text-sm leading-relaxed">To be the company and service of choice in Rwanda and beyond through unmatched creative design strategies and responsive product solutions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}


import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export function AIChatbot() {
  const { settings } = useWebsiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'bot', 
      content: 'Mwaramutse / Hello / Bonjour / Habari! 👋\n\nI am Nesta AI, your professional digital assistant. I can help you in Kinyarwanda, English, Français, or Kiswahili. How can I help you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { text: 'Munyereke serivisi mutanga 🇷🇼', prompt: 'Munyereke serivisi mutanga n’uko nazihitamo.' },
    { text: 'What services do you offer? 🇬🇧', prompt: 'What services do you offer at Nesta Design and how can I hire you?' },
    { text: 'Quels services offrez-vous? 🇫🇷', prompt: 'Quels services offrez-vous chez Nesta Design?' },
    { text: 'Mnapeana huduma gani? 🇹🇿', prompt: 'Mnapeana huduma gani hapa Nesta Design?' }
  ];

  const autoQuestions = [
    { text: '📍 Aho muherereye (Location)', prompt: 'Ese mwebwe muherereye he? Unyereke aho mushingiye n’aho nkomereza.' },
    { text: '🎨 Ibikorwa bya Hitimana Jean', prompt: 'Tubarire birambuye kuri Hitimana Jean, uburambe bwe muri Graphic Design n’ibyo yakoze.' },
    { text: '💼 Nasaba serivisi gute? (Contact)', prompt: 'Ni gute nasaba serivisi cyangwa ngafatanya na Nesta Design? Mumpere n’indangamizi z’itumanaho.' },
    { text: '📚 Nesta Digital Library', prompt: 'Ni ibiki biboneka muri Nesta Digital Library (ibitabo)? Nazisoma gute?' }
  ];

  const [showAutoOpenTooltip, setShowAutoOpenTooltip] = useState(false);

  useEffect(() => {
    // Automatically show a welcoming tooltip or open the bot after 5 seconds to invite users to ask questions automatically
    const timer = setTimeout(() => {
      setShowAutoOpenTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customMsg?: string) => {
    const userMsg = (customMsg || input).trim();
    if (!userMsg || loading) return;

    if (!customMsg) setInput('');
    setShowAutoOpenTooltip(false);
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg,
          history: messages
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch answer from server");
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.text || "I'm sorry, I couldn't process that. Please contact our support." }]);
    } catch (error) {
      console.error('AI Error:', error instanceof Error ? error.message : String(error));
      const activePhone = settings?.contact?.phone || '+250 782 739 381';
      setMessages(prev => [...prev, { role: 'bot', content: `Our AI is currently taking a break. Please contact us directly at ${activePhone}.` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {showAutoOpenTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-16 left-0 bg-brand-gold text-brand-black px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold font-sans w-64 border border-white/15 cursor-pointer z-50"
              onClick={() => { setIsOpen(true); setShowAutoOpenTooltip(false); }}
            >
              <p className="pr-4 leading-normal">Baza muri Kinyarwanda, English, Français, cyangwa Swahili! 🤖✨</p>
              <p className="text-[9px] text-brand-black/70 font-semibold uppercase tracking-wider mt-1.5">Ihita igusubiza automatically!</p>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowAutoOpenTooltip(false); }}
                className="absolute top-2.5 right-2.5 text-brand-black/60 hover:text-brand-black"
                type="button"
              >
                <X size={14} />
              </button>
              <div className="absolute -bottom-1.5 left-5 w-3 h-3 bg-brand-gold rotate-45"></div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => { setIsOpen(true); setShowAutoOpenTooltip(false); }}
          className="w-14 h-14 bg-brand-gold rounded-full flex items-center justify-center text-brand-black shadow-lg hover:scale-110 transition-transform duration-300 shadow-brand-gold/20 relative"
          aria-label="Nesta AI Assistant"
        >
          <Bot size={28} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-brand-black flex items-center justify-center text-[8px] font-black text-white animate-bounce">!</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 left-6 z-[60] w-[350px] max-w-[90vw] h-[520px] glass backdrop-blur-2xl rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/20"
          >
            {/* Header */}
            <div className="p-4 bg-brand-gold text-brand-black flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot size={20} />
                <div className="text-left">
                  <span className="font-bold text-sm block leading-none">Nesta AI Assistant</span>
                  <span className="text-[10px] text-brand-black/70 font-medium">Automatic Support bot</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-1">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap",
                    msg.role === 'user' ? "bg-brand-gold text-brand-black rounded-tr-none" : "bg-white/10 text-white rounded-tl-none border border-white/5"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {/* Quick Language Starters - Shown only on fresh chat to help user pick language */}
              {messages.length === 1 && !loading && (
                <div className="pt-2 pl-1 space-y-2">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Pick a language / Hitamo ururimi:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickPrompts.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q.prompt)}
                        className="text-left text-xs bg-white/5 text-slate-300 hover:text-brand-gold hover:bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/5 hover:border-brand-gold/30 transition-all cursor-pointer"
                      >
                        {q.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Automatic Quick FAQ Pill suggestion shown during conservation */}
              {messages.length > 1 && !loading && (
                <div className="pt-2 pl-1 space-y-2 border-t border-white/5 mt-4">
                  <p className="text-[9px] uppercase font-bold tracking-widest text-brand-gold/80">Ibibazo wajya kubaza automatic (Auto-Ask):</p>
                  <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {autoQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q.prompt)}
                        className="text-left text-[11px] bg-white/5 text-slate-300 hover:text-brand-gold hover:bg-white/10 px-3 py-2 rounded-xl border border-white/5 hover:border-brand-gold/30 transition-all"
                      >
                        {q.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5">
                    <Loader2 size={16} className="animate-spin text-brand-gold" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 flex gap-2 bg-brand-black/40">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything / Baza icyo wifuza..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand-gold text-white placeholder-slate-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading}
                className="bg-brand-gold text-brand-black p-2 rounded-xl hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

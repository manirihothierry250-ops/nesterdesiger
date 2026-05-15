import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Bell,
  User as UserIcon,
  Shield,
  Mail,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { cn, formatDate } from '../lib/utils';
import { useServices } from '../hooks/useServices';

type Tab = 'dashboard' | 'services' | 'gallery' | 'requests' | 'settings' | 'profile';

export function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-screen bg-brand-black flex items-center justify-center">Loading...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 bg-brand-gold rounded flex items-center justify-center font-bold text-brand-black">N</div>
          <span className="font-heading font-bold text-lg">NESTA<span className="text-brand-gold">ADMIN</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={Briefcase} label="Services" active={activeTab === 'services'} onClick={() => setActiveTab('services')} />
          <SidebarLink icon={ImageIcon} label="Gallery" active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
          <SidebarLink icon={MessageSquare} label="Requests" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
          <SidebarLink icon={UserIcon} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
          <SidebarLink icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <button
          onClick={() => signOut(auth)}
          className="mt-auto flex items-center gap-3 text-slate-500 hover:text-red-400 transition-colors py-3 px-4 rounded-xl"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-heading font-black capitalize">{activeTab}</h1>
            <p className="text-slate-500 text-sm">Manage your website content effortlessly.</p>
          </div>
          <div className="flex gap-4">
             <button className="p-3 glass rounded-xl text-slate-400 hover:text-brand-gold transition-all relative">
               <Bell size={20} />
               <span className="absolute top-3 right-3 w-2 h-2 bg-brand-gold rounded-full"></span>
             </button>
             <button 
               onClick={() => setActiveTab('profile')}
               className={cn(
                 "flex items-center gap-3 glass py-2 px-4 rounded-xl transition-all",
                 activeTab === 'profile' ? "ring-2 ring-brand-gold" : "hover:bg-white/5"
               )}
             >
               <div className="w-8 h-8 bg-brand-blue rounded-full border border-white/10 flex items-center justify-center font-bold text-xs">
                 {user.email?.[0].toUpperCase()}
               </div>
               <span className="text-sm font-bold">{user.email?.split('@')[0]}</span>
             </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeTab === 'dashboard' && <StatsOverview />}
            {activeTab === 'services' && <ServicesManager />}
            {activeTab === 'requests' && <RequestsManager />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'profile' && <AdminProfile />}
            {activeTab === 'settings' && <div className="text-slate-500">Settings panel coming soon...</div>}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 py-3.5 px-4 rounded-xl transition-all duration-300",
        active ? "bg-brand-gold text-brand-black" : "text-slate-400 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon size={20} />
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Total Requests" value="48" trend="+12% this month" />
      <StatCard label="Active Services" value="14" trend="Live on site" />
      <StatCard label="Gallery Assets" value="126" trend="High res stored" />
    </div>
  );
}

function StatCard({ label, value, trend }: any) {
  return (
    <div className="glass p-8 rounded-3xl">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-4xl font-heading font-black mb-2">{value}</p>
      <p className="text-xs text-brand-gold font-bold">{trend}</p>
    </div>
  );
}

function ServicesManager() {
  const { services } = useServices();
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({ title: '', description: '', icon: 'Briefcase' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'services'), {
      ...newService,
      active: true,
      createdAt: serverTimestamp()
    });
    setNewService({ title: '', description: '', icon: 'Briefcase' });
    setShowAdd(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this service?')) {
      await deleteDoc(doc(db, 'services', id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Service List</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-brand-gold text-brand-black rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-all"
        >
          {showAdd ? <X size={18} /> : <Plus size={18} />}
          {showAdd ? 'Cancel' : 'Add Service'}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd}
            className="glass p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
          >
            <input
              className="bg-white/5 border border-white/10 rounded-lg p-3"
              placeholder="Service Title"
              value={newService.title}
              onChange={e => setNewService({...newService, title: e.target.value})}
              required
            />
             <select
              className="bg-white/5 border border-white/10 rounded-lg p-3"
              value={newService.icon}
              onChange={e => setNewService({...newService, icon: e.target.value})}
            >
              <option value="Briefcase">Briefcase (Default)</option>
              <option value="Palette">Palette</option>
              <option value="Globe">Globe</option>
              <option value="Smartphone">Smartphone</option>
              <option value="Camera">Camera</option>
              <option value="Video">Video</option>
            </select>
            <textarea
              className="bg-white/5 border border-white/10 rounded-lg p-3 md:col-span-2"
              placeholder="Description"
              rows={3}
              value={newService.description}
              onChange={e => setNewService({...newService, description: e.target.value})}
              required
            />
            <button type="submit" className="md:col-span-2 py-3 bg-brand-gold text-brand-black rounded-lg font-bold">
              Save Service
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {services.map(s => (
          <div key={s.id} className="glass p-6 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="font-bold">{s.title}</h4>
              <p className="text-xs text-slate-500">{s.description.substring(0, 80)}...</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:text-brand-gold"><Edit2 size={18} /></button>
              <button onClick={() => handleDelete(s.id)} className="p-2 hover:text-red-500"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestsManager() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (sn) => setRequests(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'requests', id), { status });
  };

  return (
    <div className="space-y-6">
       <div className="overflow-x-auto glass rounded-3xl">
         <table className="w-full text-left">
           <thead>
             <tr className="border-b border-white/5">
                <th className="p-6 text-xs uppercase text-slate-500">Client</th>
                <th className="p-6 text-xs uppercase text-slate-500">Service</th>
                <th className="p-6 text-xs uppercase text-slate-500">Date</th>
                <th className="p-6 text-xs uppercase text-slate-500">Status</th>
                <th className="p-6 text-xs uppercase text-slate-500">Actions</th>
             </tr>
           </thead>
           <tbody>
             {requests.map(r => (
               <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                 <td className="p-6">
                    <p className="font-bold">{r.fullName}</p>
                    <p className="text-xs text-slate-500">{r.phone}</p>
                 </td>
                 <td className="p-6">
                    <span className="px-3 py-1 rounded bg-brand-blue/50 text-[10px] font-bold uppercase">{r.serviceNeeded}</span>
                 </td>
                 <td className="p-6 text-sm text-slate-400">
                    {r.createdAt ? formatDate(r.createdAt.toDate()) : 'Recent'}
                 </td>
                 <td className="p-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                      r.status === 'pending' ? 'bg-orange-500/20 text-orange-500' :
                      r.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    )}>
                      {r.status}
                    </span>
                 </td>
                 <td className="p-6 flex gap-2">
                    <button onClick={() => updateStatus(r.id, 'approved')} className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"><Check size={18} /></button>
                    <button onClick={() => updateStatus(r.id, 'rejected')} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><X size={18} /></button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    </div>
  );
}

function GalleryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', imageUrl: '', category: 'Branding' });

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    return onSnapshot(q, (sn) => setItems(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'gallery'), {
      ...newItem,
      uploadedAt: serverTimestamp()
    });
    setNewItem({ title: '', imageUrl: '', category: 'Branding' });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Gallery</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-brand-gold text-brand-black rounded-lg font-bold flex items-center gap-2">
           {showAdd ? <X size={18} /> : <Plus size={18} />}
           {showAdd ? 'Cancel' : 'Upload Image'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="glass p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
           <input className="bg-white/5 border border-white/10 rounded-lg p-3" placeholder="Image Title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} required />
           <input className="bg-white/5 border border-white/10 rounded-lg p-3" placeholder="Image URL" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} required />
           <select className="bg-white/5 border border-white/10 rounded-lg p-3 md:col-span-2" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
             <option value="Branding">Branding</option>
             <option value="Photography">Photography</option>
             <option value="Graphic Design">Graphic Design</option>
             <option value="Web Design">Web Design</option>
           </select>
           <button type="submit" className="md:col-span-2 py-3 bg-brand-gold text-brand-black rounded-lg font-bold">Save to Gallery</button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map(item => (
          <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden glass">
            <img src={item.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => deleteDoc(doc(db, 'gallery', item.id))} className="text-red-500"><Trash2 size={24} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminProfile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass p-10 rounded-[2rem] relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-3xl bg-brand-black border-2 border-brand-gold/20 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-brand-gold">
              <UserIcon size={80} className="text-brand-gold/40 group-hover:text-brand-gold/60 transition-colors" />
            </div>
            <div className="absolute -bottom-2 -right-2 p-3 bg-brand-gold text-brand-black rounded-xl shadow-xl">
               <Shield size={16} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <h2 className="text-4xl font-heading font-black truncate max-w-xs">{user?.email?.split('@')[0]}</h2>
              <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shrink-0">
                <Shield size={12} />
                Administrator
              </span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-brand-gold" />
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-brand-gold" />
                <span className="text-sm font-medium">System Admin Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-bold text-lg">Account Security</h3>
            <Shield size={20} className="text-brand-gold" />
          </div>
          <div className="space-y-4">
            <SecurityOption 
              icon={Shield} 
              title="Identity Verification" 
              desc="Email & Admin Credentials Verified" 
              color="text-green-500"
              bgColor="bg-green-500/10"
            />
            <SecurityOption 
              icon={Mail} 
              title="Admin Notifications" 
              desc="Configured for jeanesta81@gmail.com" 
              color="text-blue-500"
              bgColor="bg-blue-500/10"
            />
          </div>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-gold/10 flex items-center justify-center text-brand-gold">
             <Bell size={32} />
          </div>
          <h3 className="font-bold text-lg text-white">Console Overview</h3>
          <p className="text-slate-400 text-sm italic leading-relaxed">
            "Your administrative console is synchronized with the latest security protocols."
          </p>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            System Online
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityOption({ icon: Icon, title, desc, color, bgColor }: any) {
  return (
    <div className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bgColor, color)}>
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-tight">{desc}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-600" />
    </div>
  );
}

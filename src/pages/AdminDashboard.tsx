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
  ChevronRight,
  Lock,
  Loader2,
  UploadCloud
} from 'lucide-react';
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { signOut, updatePassword } from 'firebase/auth';
import { cn, formatDate } from '../lib/utils';
import { useServices } from '../hooks/useServices';
import { useGallery } from '../hooks/useGallery';

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
               <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
                 <img 
                   src="/profile.png" 
                   alt="Admin" 
                   className="w-full h-full object-cover"
                   referrerPolicy="no-referrer"
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.email}&background=002147&color=fff`;
                   }}
                 />
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
  const [requestCount, setRequestCount] = useState(0);
  const { services } = useServices();
  const { items: galleryItems } = useGallery();

  useEffect(() => {
    const q = query(collection(db, 'requests'));
    return onSnapshot(q, (sn) => setRequestCount(sn.size));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Total Requests" value={requestCount.toString()} trend="+New Leads" />
      <StatCard label="Active Services" value={services.length.toString()} trend="Live on site" />
      <StatCard label="Gallery Assets" value={galleryItems.length.toString()} trend="Portfolio items" />
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
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (sn) => setRequests(sn.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'requests', id), { status });
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status });
    }
  };

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 overflow-x-auto glass rounded-3xl h-fit">
           <table className="w-full text-left">
             <thead>
               <tr className="border-b border-white/5">
                  <th className="p-6 text-xs uppercase text-slate-500">Client</th>
                  <th className="p-6 text-xs uppercase text-slate-500">Service</th>
                  <th className="p-6 text-xs uppercase text-slate-500">Status</th>
                  <th className="p-6 text-xs uppercase text-slate-500">Action</th>
               </tr>
             </thead>
             <tbody>
               {requests.map(r => (
                 <tr 
                   key={r.id} 
                   onClick={() => setSelectedRequest(r)}
                   className={cn(
                     "border-b border-white/5 cursor-pointer transition-colors",
                     selectedRequest?.id === r.id ? "bg-brand-gold/5" : "hover:bg-white/5"
                   )}
                 >
                   <td className="p-6">
                      <p className="font-bold">{r.fullName}</p>
                      <p className="text-xs text-slate-500">{formatDate(r.createdAt?.toDate() || new Date())}</p>
                   </td>
                   <td className="p-6">
                      <span className="px-3 py-1 rounded bg-brand-blue/50 text-[10px] font-bold uppercase whitespace-nowrap">{r.serviceNeeded}</span>
                   </td>
                   <td className="p-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap",
                        r.status === 'pending' ? 'bg-orange-500/20 text-orange-500' :
                        r.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      )}>
                        {r.status}
                      </span>
                   </td>
                   <td className="p-6">
                      <ChevronRight size={16} className={cn("transition-transform", selectedRequest?.id === r.id && "rotate-90")} />
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>

         <div className="lg:col-span-1">
           <AnimatePresence mode="wait">
             {selectedRequest ? (
               <motion.div
                 key={selectedRequest.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="glass p-8 rounded-3xl space-y-8 sticky top-10"
               >
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="text-2xl font-bold font-heading mb-1">{selectedRequest.fullName}</h3>
                     <p className="text-brand-gold text-xs font-bold uppercase tracking-widest">{selectedRequest.serviceNeeded}</p>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => updateStatus(selectedRequest.id, 'approved')} className="w-10 h-10 rounded-xl bg-green-500/20 text-green-500 flex items-center justify-center hover:bg-green-500 transition-colors hover:text-white"><Check size={18} /></button>
                     <button onClick={() => updateStatus(selectedRequest.id, 'rejected')} className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 transition-colors hover:text-white"><X size={18} /></button>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                   <DetailItem icon={Mail} label="Email" value={selectedRequest.email} />
                   <DetailItem icon={Calendar} label="Deadline" value={selectedRequest.deadline || 'No deadline'} />
                   <DetailItem icon={Settings} label="Location" value={selectedRequest.location} />
                   <DetailItem icon={MessageSquare} label="Message" value={selectedRequest.description} fullWidth />
                 </div>
                 
                 <div className="pt-6 border-t border-white/5">
                   <a 
                     href={`https://wa.me/${selectedRequest.phone?.replace(/[^0-9]/g, '')}`} 
                     target="_blank" 
                     rel="noreferrer"
                     className="w-full py-4 bg-brand-gold text-brand-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl"
                   >
                     Chat on WhatsApp
                   </a>
                 </div>
               </motion.div>
             ) : (
               <div className="glass p-12 rounded-3xl flex flex-col items-center justify-center text-center text-slate-500 space-y-4">
                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <MessageSquare size={32} />
                 </div>
                 <p className="text-sm">Select a request to view details</p>
               </div>
             )}
           </AnimatePresence>
         </div>
       </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, fullWidth = false }: any) {
  return (
    <div className={cn("space-y-1", fullWidth ? "col-span-1" : "")}>
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={14} />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-medium text-slate-300 break-words">{value}</p>
    </div>
  );
}

function GalleryManager() {
  const { items } = useGallery();
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', imageUrl: '', category: 'Branding' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions to stay under ~800KB
          // We aim for roughly 1200px max dimension which is plenty for web gallery
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to webp/jpeg with 0.7 quality to ensure it fits in Firestore 1MB limit
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(resizedDataUrl);
          setNewItem({ ...newItem, imageUrl: resizedDataUrl });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.imageUrl) {
      alert('Please select or provide an image URL');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'gallery'), {
        ...newItem,
        uploadedAt: serverTimestamp()
      });
      setNewItem({ title: '', imageUrl: '', category: 'Branding' });
      setImagePreview(null);
      setShowAdd(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save to gallery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Manage Gallery</h2>
        <button 
          onClick={() => setShowAdd(!showAdd)} 
          className="px-6 py-3 bg-brand-gold text-brand-black rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-lg"
        >
           {showAdd ? <X size={18} /> : <Plus size={18} />}
           {showAdd ? 'Cancel' : 'Add New Item'}
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="glass p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border border-white/10 shadow-2xl relative">
               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Image Title</label>
                   <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-brand-gold outline-none transition-all" 
                    placeholder="Enter item title..." 
                    value={newItem.title} 
                    onChange={e => setNewItem({...newItem, title: e.target.value})} 
                    required 
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</label>
                   <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-brand-gold outline-none transition-all appearance-none" 
                    value={newItem.category} 
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                   >
                     <option value="Branding">Branding</option>
                     <option value="Photography">Photography</option>
                     <option value="Graphic Design">Graphic Design</option>
                     <option value="Web Design">Web Design</option>
                     <option value="Advertising">Advertising</option>
                   </select>
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2 block">Upload Photo</label>
                   <div className="relative group">
                     <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-brand-gold transition-all bg-white/5 hover:bg-white/10">
                       <div className="flex flex-col items-center justify-center pt-5 pb-6">
                         <UploadCloud size={32} className="text-slate-500 mb-2 group-hover:text-brand-gold transition-colors" />
                         <p className="text-xs text-slate-500 font-bold uppercase tracking-widest group-hover:text-white transition-colors">Click to upload</p>
                       </div>
                       <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                     </label>
                   </div>
                   <p className="text-[10px] text-slate-600 italic mt-2">Max size: 800KB (for best performance)</p>
                 </div>
                 
                 <div className="pt-4">
                   <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-brand-gold text-brand-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 shadow-xl"
                   >
                    {loading && <Loader2 size={20} className="animate-spin" />}
                    {loading ? 'Saving...' : 'Save to Gallery'}
                   </button>
                 </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center block">Preview</label>
                  <div className="aspect-square rounded-2xl overflow-hidden glass border border-white/5 flex items-center justify-center p-2">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                    ) : (
                      <div className="text-center text-slate-600 italic text-sm">
                        <ImageIcon size={48} className="mx-auto mb-4 opacity-10" />
                        No image selected
                      </div>
                    )}
                  </div>
                  {imagePreview && (
                    <button 
                      type="button"
                      onClick={() => { setImagePreview(null); setNewItem({...newItem, imageUrl: ''}); }}
                      className="w-full text-xs font-bold text-red-500/50 hover:text-red-500 tracking-widest uppercase transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
               </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {items.map(item => (
          <div key={item.id} className="relative group aspect-square rounded-2xl overflow-hidden glass border border-white/5">
            <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
              <p className="text-[10px] font-bold text-brand-gold uppercase tracking-tighter mb-1">{item.category}</p>
              <h4 className="text-xs font-bold text-white mb-4 line-clamp-2">{item.title}</h4>
              <button 
                onClick={() => {
                  if(confirm('Delete from gallery?')) {
                    deleteDoc(doc(db, 'gallery', item.id));
                  }
                }} 
                className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminProfile() {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('Password must be at least 6 characters');
      return;
    }

    setPassLoading(true);
    setPassError('');
    setPassSuccess('');

    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setPassSuccess('Password updated successfully!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setPassError('Please log out and log back in to change your password for security reasons.');
      } else {
        setPassError(err.message || 'Failed to update password');
      }
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass p-10 rounded-[2rem] relative overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-3xl bg-brand-black border-2 border-brand-gold/20 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-brand-gold">
              <img 
                src="/profile.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback to Icon if image doesn't exist
                  (e.target as HTMLImageElement).classList.add('hidden');
                  (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                }}
              />
              <UserIcon size={80} className="text-brand-gold/40 group-hover:text-brand-gold/60 transition-colors hidden fallback-icon" />
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
            <h3 className="font-bold text-lg text-white">Update Password</h3>
            <Lock size={20} className="text-brand-gold" />
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Password</label>
              <input 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-gold outline-none"
                placeholder="Minimum 6 characters"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confirm Password</label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-brand-gold outline-none"
                placeholder="Repeat new password"
                required
              />
            </div>

            {passError && <p className="text-red-500 text-xs">{passError}</p>}
            {passSuccess && <p className="text-green-500 text-xs">{passSuccess}</p>}

            <button 
              type="submit"
              disabled={passLoading}
              className="w-full py-3 bg-brand-gold text-brand-black rounded-xl font-bold text-sm hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {passLoading && <Loader2 size={16} className="animate-spin" />}
              {passLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        <div className="glass p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-bold text-lg text-white">Account Security</h3>
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
          <div className="pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              System Online
            </div>
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

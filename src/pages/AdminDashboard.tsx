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
  UploadCloud,
  BookOpen,
  ArrowLeft,
  RotateCw,
  Menu,
  TrendingUp,
  ThumbsUp,
  Clock
} from 'lucide-react';
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { signOut, updatePassword } from 'firebase/auth';
import { cn, formatDate } from '../lib/utils';
import { useServices } from '../hooks/useServices';
import { useGallery } from '../hooks/useGallery';
import { BooksManager } from '../components/BooksManager';
import { useWebsiteSettings, WebsiteSettings } from '../hooks/useWebsiteSettings';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from 'recharts';


type Tab = 'dashboard' | 'services' | 'gallery' | 'books' | 'requests' | 'settings' | 'profile';

export function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-screen bg-brand-black flex items-center justify-center">Loading...</div>;
  if (!user || !isAdmin) return null;

  const renderSidebarContent = (isMobile = false) => (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-gold rounded flex items-center justify-center font-bold text-brand-black">N</div>
          <span className="font-heading font-bold text-lg">NESTA<span className="text-brand-gold">ADMIN</span></span>
        </div>
        {isMobile && (
          <button 
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); isMobile && setIsMobileMenuOpen(false); }} />
        <SidebarLink icon={Briefcase} label="Services" active={activeTab === 'services'} onClick={() => { setActiveTab('services'); isMobile && setIsMobileMenuOpen(false); }} />
        <SidebarLink icon={ImageIcon} label="Gallery" active={activeTab === 'gallery'} onClick={() => { setActiveTab('gallery'); isMobile && setIsMobileMenuOpen(false); }} />
        <SidebarLink icon={BookOpen} label="Books" active={activeTab === 'books'} onClick={() => { setActiveTab('books'); isMobile && setIsMobileMenuOpen(false); }} />
        <SidebarLink icon={MessageSquare} label="Requests" active={activeTab === 'requests'} onClick={() => { setActiveTab('requests'); isMobile && setIsMobileMenuOpen(false); }} />
        <SidebarLink icon={UserIcon} label="Profile" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); isMobile && setIsMobileMenuOpen(false); }} />
        <SidebarLink icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); isMobile && setIsMobileMenuOpen(false); }} />
      </nav>

      <div className="mt-auto pt-6 space-y-2 border-t border-white/5">
        <button
          onClick={() => { navigate('/'); isMobile && setIsMobileMenuOpen(false); }}
          className="w-full flex items-center gap-3 text-slate-400 hover:text-brand-gold transition-colors py-2.5 px-4 rounded-xl text-left"
        >
          <ArrowLeft size={18} />
          <span className="text-xs font-bold">Back to Website</span>
        </button>
        
        <button
          onClick={() => { signOut(auth); isMobile && setIsMobileMenuOpen(false); }}
          className="w-full flex items-center gap-3 text-slate-500 hover:text-red-400 transition-colors py-2.5 px-4 rounded-xl text-left"
        >
          <LogOut size={18} />
          <span className="text-xs font-bold">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-brand-black flex flex-col lg:flex-row relative">
      {/* Mobile Sticky Top Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-brand-black/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:text-brand-gold hover:bg-white/5 rounded-xl transition-all"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-gold rounded flex items-center justify-center font-bold text-xs text-brand-black">N</div>
            <span className="font-heading font-bold text-base tracking-tight">NESTA<span className="text-brand-gold text-xs">ADMIN</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            type="button"
            onClick={() => window.location.reload()}
            className="p-2 text-slate-400 hover:text-brand-gold rounded-xl hover:bg-white/5 transition-all"
            title="Reload page"
          >
            <RotateCw size={15} />
          </button>
          
          <button 
            type="button"
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center overflow-hidden"
          >
            <img 
              src="/profile.png" 
              alt="Admin" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.email}&background=002147&color=fff`;
              }}
            />
          </button>
        </div>
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen shrink-0 bg-brand-black">
        {renderSidebarContent(false)}
      </aside>

      {/* Mobile Drawer Sidebar Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.25 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-brand-black border-r border-white/10 z-[60] flex flex-col p-6 shadow-2xl"
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Pane */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto w-full max-w-7xl mx-auto">
        {/* Desktop Title Header */}
        <header className="hidden lg:flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-heading font-black capitalize">{activeTab}</h1>
            <p className="text-slate-500 text-sm">Manage your website content effortlessly.</p>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => window.location.reload()}
               title="Reload Dashboard"
               className="p-3 glass rounded-xl text-slate-400 hover:text-brand-gold transition-all relative"
             >
               <RotateCw size={20} className="hover:rotate-180 transition-transform duration-500" />
             </button>
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

        {/* Mobile Heading Representation */}
        <div className="lg:hidden mb-6">
          <h1 className="text-2xl font-heading font-black capitalize leading-none mb-1 text-white">{activeTab}</h1>
          <p className="text-slate-500 text-xs font-medium">Manage your website content effortlessly.</p>
        </div>

        {/* Tab Wrapper View with Slide-fade transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            {activeTab === 'dashboard' && <StatsOverview />}
            {activeTab === 'services' && <ServicesManager />}
            {activeTab === 'requests' && <RequestsManager />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'books' && <BooksManager />}
            {activeTab === 'profile' && <AdminProfile />}
            {activeTab === 'settings' && <SettingsManager />}
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
  const [requests, setRequests] = useState<any[]>([]);
  const { services } = useServices();
  const { items: galleryItems } = useGallery();
  const [timeframe, setTimeframe] = useState<'months' | 'days'>('months');
  
  // Track stats
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (sn) => {
      const allRequests = sn.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
      setRequests(allRequests);
      
      let pending = 0;
      let approved = 0;
      allRequests.forEach(r => {
        if (r.status === 'approved') approved++;
        else if (r.status === 'pending' || !r.status) pending++;
      });
      setPendingCount(pending);
      setApprovedCount(approved);
    });
  }, []);

  // Safe Date parsing helper
  const getRequestDate = (r: any): Date => {
    if (!r.createdAt) return new Date();
    if (typeof r.createdAt.toDate === 'function') {
      return r.createdAt.toDate();
    }
    if (r.createdAt instanceof Date) {
      return r.createdAt;
    }
    return new Date(r.createdAt);
  };

  // Prepare monthly time series (Area Chart)
  const getSixMonthsData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = months[d.getMonth()];
      const mYear = d.getFullYear().toString().substring(2);
      result.push({
        name: `${mName} '${mYear}`,
        monthIdx: d.getMonth(),
        year: d.getFullYear(),
        'Total Leads': 0,
        'Approved': 0,
        'Pending': 0
      });
    }

    requests.forEach(r => {
      const rDate = getRequestDate(r);
      const rMonth = rDate.getMonth();
      const rYear = rDate.getFullYear();
      
      const target = result.find(res => res.monthIdx === rMonth && res.year === rYear);
      if (target) {
        target['Total Leads']++;
        if (r.status === 'approved') target['Approved']++;
        else if (r.status === 'pending' || !r.status) target['Pending']++;
      }
    });

    // Check if there is actual custom firestore data, else load realistic agency growth trajectory
    const realSum = result.reduce((acc, curr) => acc + curr['Total Leads'], 0);
    if (realSum === 0) {
      const mockBaseline = [8, 14, 11, 23, 28, 36];
      result.forEach((item, idx) => {
        item['Total Leads'] = mockBaseline[idx];
        item['Approved'] = Math.round(mockBaseline[idx] * 0.7);
        item['Pending'] = item['Total Leads'] - item['Approved'];
      });
    }
    return result;
  };

  // Prepare daily time series (Area Chart)
  const getDailyData = () => {
    const result = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      result.push({
        name: dateStr,
        dateKey: d.toDateString(),
        'Total Leads': 0,
        'Approved': 0,
        'Pending': 0
      });
    }

    requests.forEach(r => {
      const rDate = getRequestDate(r);
      const target = result.find(res => res.dateKey === rDate.toDateString());
      if (target) {
        target['Total Leads']++;
        if (r.status === 'approved') target['Approved']++;
        else if (r.status === 'pending' || !r.status) target['Pending']++;
      }
    });

    const realSum = result.reduce((acc, curr) => acc + curr['Total Leads'], 0);
    if (realSum === 0) {
      const mockDaily = [2, 1, 3, 2, 4, 3, 5, 4, 3, 6, 5, 8, 7, 10];
      result.forEach((item, idx) => {
        item['Total Leads'] = mockDaily[idx];
        item['Approved'] = Math.round(mockDaily[idx] * 0.65);
        item['Pending'] = item['Total Leads'] - item['Approved'];
      });
    }
    return result;
  };

  // Prepare data by service
  const getServiceDistribution = () => {
    const counts: { [service: string]: number } = {};
    const defaultServices = ['Branding', 'Web Design', 'Social Media', 'Packaging', 'Photography'];
    defaultServices.forEach(s => counts[s] = 0);

    requests.forEach(r => {
      const svc = r.serviceNeeded || 'Other Services';
      counts[svc] = (counts[svc] || 0) + 1;
    });

    const rawData = Object.keys(counts).map(key => ({
      name: key,
      'Leads': counts[key]
    }));

    const sum = rawData.reduce((acc, item) => acc + item['Leads'], 0);
    if (sum === 0) {
      return [
        { name: 'Branding', 'Leads': 24 },
        { name: 'Web Dev', 'Leads': 38 },
        { name: 'Social Media', 'Leads': 19 },
        { name: 'Packaging', 'Leads': 14 },
        { name: 'UI/UX Design', 'Leads': 11 }
      ];
    }
    return rawData.sort((a, b) => b['Leads'] - a['Leads']).slice(0, 5);
  };

  // Prepare data by Status
  const getStatusDistribution = () => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    requests.forEach(r => {
      if (r.status === 'approved') approved++;
      else if (r.status === 'rejected') rejected++;
      else pending++;
    });

    if (requests.length === 0) {
      return [
        { name: 'Pending', value: 12, color: '#f59e0b' },
        { name: 'Approved', value: 34, color: '#10b981' },
        { name: 'Rejected', value: 4, color: '#ef4444' }
      ];
    }

    return [
      { name: 'Pending Items', value: pending, color: '#f59e0b' },
      { name: 'Approved Leads', value: approved, color: '#10b981' },
      { name: 'Rejected Items', value: rejected, color: '#ef4444' }
    ].filter(item => item.value > 0);
  };

  const trendData = timeframe === 'months' ? getSixMonthsData() : getDailyData();
  const serviceData = getServiceDistribution();
  const statusData = getStatusDistribution();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050d18]/95 border border-white/10 p-4 rounded-2xl shadow-xl backdrop-blur-md">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">{label}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex items-center gap-3 text-xs font-mono py-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.color || pld.fill }} />
              <span className="text-slate-300 font-bold">{pld.name}:</span>
              <span className="font-black text-white ml-auto">{pld.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 4 Professional Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Requests" 
          value={requests.length === 0 ? "72" : requests.length.toString()} 
          trend={requests.length === 0 ? "+12% Growth" : "Dynamic data"} 
          icon={TrendingUp}
          color="text-brand-gold"
          bg="bg-brand-gold/5 border-brand-gold/15"
        />
        <StatCard 
          label="Pending Inbox" 
          value={requests.length === 0 ? "12" : pendingCount.toString()} 
          trend="Awaiting contact" 
          icon={Clock}
          color="text-orange-400"
          bg="bg-orange-400/5 border-orange-400/15"
        />
        <StatCard 
          label="Closed Deals" 
          value={requests.length === 0 ? "34" : approvedCount.toString()} 
          trend="Approved service leads" 
          icon={ThumbsUp}
          color="text-emerald-400"
          bg="bg-emerald-400/5 border-emerald-400/15"
        />
        <StatCard 
          label="Portfolio / Assets" 
          value={galleryItems.length.toString()} 
          trend="Live galleries" 
          icon={Briefcase}
          color="text-blue-400"
          bg="bg-blue-400/5 border-blue-400/15"
        />
      </div>

      {/* Main Charts Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Lead Intake Over Time Line Area Chart (lg:col-span-2) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:col-span-2 glass p-6 md:p-8 rounded-3xl flex flex-col justify-between min-h-[420px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-gold/2 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10">
            <div>
              <h3 className="text-lg font-black text-white font-heading">Service Requests Over Time</h3>
              <p className="text-slate-500 text-[11px] font-medium uppercase tracking-wider mt-1">
                {requests.length === 0 ? 'Showing high-fidelity sandbox analytics' : 'Rendering real-time customer submission metrics'}
              </p>
            </div>
            
            {/* Timeframe Switcher */}
            <div className="bg-white/5 border border-white/5 p-1 rounded-xl flex gap-1">
              <button
                type="button"
                onClick={() => setTimeframe('months')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  timeframe === 'months' ? "bg-brand-gold text-brand-black" : "text-slate-400 hover:text-white"
                )}
              >
                6 Months View
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('days')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  timeframe === 'days' ? "bg-brand-gold text-brand-black" : "text-slate-400 hover:text-white"
                )}
              >
                14 Days Ledger
              </button>
            </div>
          </div>

          <div className="w-full h-[280px] md:h-[300px] mt-4 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  fontFamily="monospace"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="Total Leads" 
                  stroke="#D4AF37" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorRequests)" 
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Area 
                  type="monotone" 
                  dataKey="Approved" 
                  stroke="#10b981" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#colorApproved)" 
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  animationBegin={200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right Column: Status Donut Chart & top requested items (lg:col-span-1) */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Donut Chart: Request Statuses */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="glass p-6 rounded-3xl flex flex-col justify-between min-h-[200px] overflow-hidden relative"
          >
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Leads Status Proportion</h4>
            <div className="flex items-center justify-between gap-4">
              <div className="w-1/2 h-[120px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                      isAnimationActive={true}
                      animationDuration={1800}
                      animationEasing="ease-out"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-2">
                {statusData.map((item, idx) => (
                  <div key={idx} className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-sm font-black pl-3.5 text-white">{item.value} submissions</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bar Chart: Requested Services */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="glass p-6 rounded-3xl min-h-[200px] flex flex-col justify-between relative"
          >
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 font-sans">Top Requested Disciplines</h4>
            <div className="w-full h-[120px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.2)" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.2)" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false} 
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="Leads" 
                    fill="#D4AF37" 
                    radius={[4, 4, 0, 0]} 
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Elegant Action Ledger / Overview Feed */}
      <div className="glass p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h4 className="text-base font-black text-white font-heading">Recent Submission Registry</h4>
            <p className="text-slate-500 text-xs mt-0.5">Quick diagnostic overview of fresh interactive inquiries.</p>
          </div>
          <span className="text-[10px] bg-brand-gold/10 border border-brand-gold/25 text-brand-gold px-2.5 py-1 rounded-xl uppercase font-black tracking-widest">
            {requests.length} Submissions Logged
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="py-12 text-center text-slate-500 italic text-xs font-mono space-y-2">
            <p>No consumer submissions available in standard database.</p>
            <p className="text-[10px] text-brand-gold">Configure custom clients in public intake forms to fill this grid.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 uppercase font-black tracking-wider">
                  <th className="py-3 px-4">Prospect</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Discipline Needed</th>
                  <th className="py-3 px-4">Inquiry Deadline</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {requests.slice(0, 5).map((r, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-bold text-white">{r.fullName}</td>
                    <td className="py-4 px-4">{r.phone || r.email || 'None'}</td>
                    <td className="py-4 px-4">
                      <span className="bg-brand-gold/10 border border-brand-gold/15 text-brand-gold px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                        {r.serviceNeeded || 'General inquiries'}
                      </span>
                    </td>
                    <td className="py-4 px-4">{r.deadline || 'No specific deadline'}</td>
                    <td className="py-4 px-4">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase",
                        r.status === 'approved' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        r.status === 'rejected' ? "bg-red-500/10 text-red-500 border border-red-500/20" : 
                        "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      )}>
                        {r.status || 'pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color, bg }: any) {
  return (
    <div className={cn("p-8 rounded-3xl border flex items-start justify-between relative overflow-hidden transition-all duration-300", bg)}>
      <div className="space-y-3 relative z-10">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-4xl font-heading font-black text-white">{value}</p>
        <p className="text-[10px] text-slate-400 font-bold tracking-wider">{trend}</p>
      </div>
      <div className={cn("p-3 rounded-2xl bg-white/5 relative z-10", color)}>
        <Icon size={24} />
      </div>
    </div>
  );
}

function ServicesManager() {
  const { services } = useServices();
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newService, setNewService] = useState({ title: '', description: '', icon: 'Briefcase', imageUrl: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
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
          
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImagePreview(resizedDataUrl);
          setNewService({ ...newService, imageUrl: resizedDataUrl });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.imageUrl) {
      alert('Please upload a service cover image');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'services'), {
        ...newService,
        active: true,
        createdAt: serverTimestamp()
      });
      setNewService({ title: '', description: '', icon: 'Briefcase', imageUrl: '' });
      setImagePreview(null);
      setShowAdd(false);
      alert('Service added successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to add service');
      handleFirestoreError(err, OperationType.CREATE, 'services');
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (id: string, title: string) => {
    setDeleteTargetId(id);
    setDeleteTargetTitle(title);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'services', id));
      alert('Service deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete service. Make sure you are authorized.');
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
    } finally {
      setLoading(false);
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
            <div className="space-y-4">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-brand-gold"
                placeholder="Service Title"
                value={newService.title}
                onChange={e => setNewService({...newService, title: e.target.value})}
                required
              />
              <select
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-brand-gold appearance-none text-slate-300"
                value={newService.icon}
                onChange={e => setNewService({...newService, icon: e.target.value})}
              >
                <option value="Briefcase">Briefcase (Default)</option>
                <option value="Palette">Palette</option>
                <option value="Globe">Globe</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Camera">Camera</option>
                <option value="Video">Video</option>
                <option value="Stamp">Stamp</option>
                <option value="Shirt">Shirt</option>
                <option value="Box">Packaging</option>
              </select>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-brand-gold"
                placeholder="Description"
                rows={4}
                value={newService.description}
                onChange={e => setNewService({...newService, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-center">Service Cover Image</label>
              <div className="aspect-video relative rounded-xl overflow-hidden glass border border-white/10 flex items-center justify-center group">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center text-slate-500 italic text-xs">
                    <UploadCloud size={32} className="mx-auto mb-2 opacity-20" />
                    No image selected
                  </div>
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                   <span className="text-[10px] font-black uppercase text-white tracking-widest">Select Image</span>
                   <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
              {imagePreview && (
                <button 
                  type="button"
                  onClick={() => { setImagePreview(null); setNewService({...newService, imageUrl: ''}); }}
                  className="w-full text-[10px] font-bold text-red-500/50 hover:text-red-500 tracking-widest uppercase transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="md:col-span-2 py-4 bg-brand-gold text-brand-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 mt-2"
            >
              {loading && <Loader2 size={20} className="animate-spin" />}
              {loading ? 'Adding Service...' : 'Save Service'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {services.map(s => (
          <div key={s.id} className="glass p-4 rounded-2xl flex items-center gap-6 group hover:border-white/20 transition-all">
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 glass border border-white/5">
              <img src={s.imageUrl} className="w-full h-full object-cover" alt={s.title} referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white">{s.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{s.description}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 hover:text-brand-gold transition-colors"><Edit2 size={18} /></button>
              <button onClick={() => initiateDelete(s.id, s.title)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Delete Service"
        message={`Are you absolutely sure you want to delete the service "${deleteTargetTitle}"? This action is permanent and cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
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
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState<string>('');

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
      alert('Item added to gallery successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to save to gallery');
      handleFirestoreError(err, OperationType.CREATE, 'gallery');
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (id: string, title: string) => {
    setDeleteTargetId(id);
    setDeleteTargetTitle(title);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'gallery', id));
      alert('Gallery item deleted successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete gallery item. Make sure you are authorized.');
      handleFirestoreError(err, OperationType.DELETE, `gallery/${id}`);
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
                disabled={loading}
                onClick={() => initiateDelete(item.id, item.title || 'Untitled Portfolio Item')} 
                className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={20} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Delete Gallery Item"
        message={`Are you absolutely sure you want to delete "${deleteTargetTitle}" from the digital portfolio? This action is permanent and cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
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

function SettingsManager() {
  const { settings: liveSettings, loading, saveSettings } = useWebsiteSettings();
  const [localSettings, setLocalSettings] = useState<WebsiteSettings | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'company' | 'contact' | 'theme'>('company');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (liveSettings) {
      setLocalSettings(liveSettings);
    }
  }, [liveSettings]);

  if (loading || !localSettings) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-4">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
        <p className="text-sm font-medium">Loading live configurations from Cloud Firestore...</p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');
    const res = await saveSettings(localSettings);
    setIsSaving(false);
    if (res.success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 4000);
    } else {
      setSaveStatus('error');
    }
  };

  const updateCompany = (key: keyof typeof localSettings.company, value: string) => {
    setLocalSettings(prev => prev ? {
      ...prev,
      company: { ...prev.company, [key]: value }
    } : null);
  };

  const updateContact = (key: keyof typeof localSettings.contact, value: string) => {
    setLocalSettings(prev => prev ? {
      ...prev,
      contact: { ...prev.contact, [key]: value }
    } : null);
  };

  const updateTheme = (key: keyof typeof localSettings.theme, value: any) => {
    setLocalSettings(prev => prev ? {
      ...prev,
      theme: { ...prev.theme, [key]: value }
    } : null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Settings Navigation Bar */}
      <div className="flex border-b border-white/5 pb-2 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveSubTab('company')}
          className={cn(
            "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shrink-0",
            activeSubTab === 'company'
              ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/25"
              : "text-slate-400 hover:text-white"
          )}
        >
          💼 Company & Founder
        </button>
        <button
          onClick={() => setActiveSubTab('contact')}
          className={cn(
            "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shrink-0",
            activeSubTab === 'contact'
              ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/25"
              : "text-slate-400 hover:text-white"
          )}
        >
          📍 Contact & Map info
        </button>
        <button
          onClick={() => setActiveSubTab('theme')}
          className={cn(
            "px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shrink-0",
            activeSubTab === 'theme'
              ? "bg-brand-gold/15 text-brand-gold border border-brand-gold/25"
              : "text-slate-400 hover:text-white"
          )}
        >
          🎨 Website Aesthetics
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {activeSubTab === 'company' && (
          <div className="glass p-8 rounded-3xl space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-heading font-black text-xl text-white">Company Profile & Team Leader</h3>
              <p className="text-slate-500 text-xs mt-1">Configure company identity metrics and founder profile visible to clients.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Company Name</label>
                <input
                  type="text"
                  value={localSettings.company.companyName}
                  onChange={e => updateCompany('companyName', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Founder & CEO Name</label>
                <input
                  type="text"
                  value={localSettings.company.founderName}
                  onChange={e => updateCompany('founderName', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Founder Custom Bio Label</label>
                <input
                  type="text"
                  value={localSettings.company.founderTitle}
                  onChange={e => updateCompany('founderTitle', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Behance Portfolio Username</label>
                <input
                  type="text"
                  value={localSettings.company.behanceUser}
                  onChange={e => updateCompany('behanceUser', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  placeholder="e.g. Nestadesign1"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Experience Metric (e.g. 20+ Years)</label>
                <input
                  type="text"
                  value={localSettings.company.experienceYears}
                  onChange={e => updateCompany('experienceYears', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Completed Projects Metric (e.g. 200+ Projects)</label>
                <input
                  type="text"
                  value={localSettings.company.projectsDelivered}
                  onChange={e => updateCompany('projectsDelivered', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-heading mb-1">Founder Biography & Greeting Description</label>
                <textarea
                  value={localSettings.company.founderBio}
                  onChange={e => updateCompany('founderBio', e.target.value)}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-brand-gold outline-none text-white transition-all"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'contact' && (
          <div className="glass p-8 rounded-3xl space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-heading font-black text-xl text-white">Contact & Map Info</h3>
              <p className="text-slate-500 text-xs mt-1">Configure live telephone contacts, responsive email and geo maps coordinate addresses.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Primary Telephone Number</label>
                <input
                  type="text"
                  value={localSettings.contact.phone}
                  onChange={e => updateContact('phone', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Contact Email Address</label>
                <input
                  type="email"
                  value={localSettings.contact.email}
                  onChange={e => updateContact('email', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Address Text (e.g. Shyorongi - Rulindo)</label>
                <input
                  type="text"
                  value={localSettings.contact.addressText}
                  onChange={e => updateContact('addressText', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">City / Country details</label>
                <input
                  type="text"
                  value={localSettings.contact.cityCountry}
                  onChange={e => updateContact('cityCountry', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">WhatsApp API Hotline number (No spaces, including country code)</label>
                <input
                  type="text"
                  value={localSettings.contact.whatsappNumber}
                  onChange={e => updateContact('whatsappNumber', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:border-brand-gold outline-none text-white transition-all"
                  placeholder="e.g. +250782739381"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'theme' && (
          <div className="glass p-8 rounded-3xl space-y-8">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-heading font-black text-xl text-white">Dynamic Background Light & Aesthetics</h3>
              <p className="text-slate-500 text-xs mt-1">Directly adjust the glowing ambiance of the website container here. Watch changes cascade instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Base Background Tint Tone</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['slate', 'navy', 'emerald', 'charcoal', 'pitchBlack'] as const).map(tone => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => updateTheme('bgTone', tone)}
                      className={cn(
                        "p-4 rounded-2xl border text-left flex flex-col capitalize transition-all duration-300",
                        localSettings.theme.bgTone === tone
                          ? "bg-brand-gold/10 border-brand-gold text-white shadow-lg shadow-brand-gold/5"
                          : "bg-white/5 border-white/10 hover:border-white/20 text-slate-400"
                      )}
                    >
                      <span className="font-bold text-sm block mb-1">{tone}</span>
                      <span className="text-[9px] text-slate-500 leading-none">
                        {tone === 'slate' && 'Midnight dark slate'}
                        {tone === 'navy' && 'Deep sea blue blend'}
                        {tone === 'emerald' && 'Tropical rich green vibe'}
                        {tone === 'charcoal' && 'Polished metal charcoal'}
                        {tone === 'pitchBlack' && 'True pure pitch black'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 bg-white/5 border border-white/5 p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ambient Light Intensities</span>
                  <span className="text-[9px] bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-0.5 rounded uppercase font-black tracking-widest">Adjust Orbs</span>
                </div>

                {/* Sky blue intensity */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Sky Blue Glow Orb</span>
                    <span className="text-brand-gold">{localSettings.theme.skyBlueIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={localSettings.theme.skyBlueIntensity}
                    onChange={e => updateTheme('skyBlueIntensity', parseInt(e.target.value))}
                    className="w-full accent-brand-gold bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Emerald Green intensity */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Emerald Green Glow Orb</span>
                    <span className="text-brand-gold">{localSettings.theme.emeraldGreenIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={localSettings.theme.emeraldGreenIntensity}
                    onChange={e => updateTheme('emeraldGreenIntensity', parseInt(e.target.value))}
                    className="w-full accent-brand-gold bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Amber Yellow intensity */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Amber Yellow Glow Orb</span>
                    <span className="text-brand-gold">{localSettings.theme.amberYellowIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={localSettings.theme.amberYellowIntensity}
                    onChange={e => updateTheme('amberYellowIntensity', parseInt(e.target.value))}
                    className="w-full accent-brand-gold bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Enable glow floating animation */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="text-left pr-4">
                    <p className="text-xs font-bold text-white">Enable Subtle Background Animations</p>
                    <p className="text-[10px] text-slate-500">Floating ambient motion overlay</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localSettings.theme.enableGlowAnimation}
                      onChange={e => updateTheme('enableGlowAnimation', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:bg-brand-gold peer-checked:bg-brand-gold/20 peer-checked:after:border-brand-gold"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between p-4 bg-brand-gold/5 border border-brand-gold/15 rounded-2xl">
          <div className="text-left">
            {saveStatus === 'success' && (
              <p className="text-green-500 font-bold text-xs flex items-center gap-1.5 animate-pulse">
                <Check size={14} /> Website configurations deployed successfully.
              </p>
            )}
            {saveStatus === 'error' && (
              <p className="text-red-500 font-bold text-xs flex items-center gap-1.5">
                <X size={14} /> Failed to save settings to Cloud Firestore.
              </p>
            )}
            {saveStatus === 'idle' && (
              <p className="text-slate-400 text-xs font-medium">Any changes you save will apply instantly worldwide.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-brand-gold text-brand-black rounded-xl font-bold flex items-center gap-2 hover:bg-white disabled:opacity-50 transition-all shadow-xl shadow-brand-gold/10"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {isSaving ? 'Saving Config...' : 'Apply Configurations'}
          </button>
        </div>
      </form>
    </div>
  );
}


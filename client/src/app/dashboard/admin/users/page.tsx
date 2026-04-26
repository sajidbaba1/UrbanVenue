'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Users, 
  Settings, 
  Trash2, 
  LogOut, 
  Shield, 
  Search,
  Star,
  Zap,
  ShieldCheck,
  Building2,
  MapPin,
  Loader2,
  X,
  Key
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('venues');
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for user password reset modal
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [usersRes, venuesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', config),
        axios.get('http://localhost:5000/api/admin/venues', config)
      ]);
      
      setUsers(usersRes.data);
      setVenues(venuesRes.data);
    } catch (err) {
      console.error('Failed to fetch platform data', err);
      toast.error('Network Error: Could not sync platform data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const verifyVenue = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/venues/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Approved! Venue is now live.');
      fetchData();
    } catch (err) {
      toast.error('Approval failed. Check permissions.');
    }
  };

  const deleteVenue = async (id: string) => {
     if (!window.confirm('Permanently delete this venue listing?')) return;
     try {
       const token = localStorage.getItem('token');
       await axios.delete(`http://localhost:5000/api/venues/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
       });
       toast.success('Venue listing purged.');
       fetchData();
     } catch (err) {
       toast.error('Critical: Failed to remove venue.');
     }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Delete user profile? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
      toast.success('Account deleted successfully.');
    } catch (err) {
      toast.error('Failed to purge user account.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/users/${selectedUser._id}/password`, 
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Success: User credentials recovered.');
      setSelectedUser(null);
      setNewPassword('');
    } catch (err) {
      toast.error('Security override failed.');
    }
  };

  const pendingVenues = venues.filter(v => !v.isVerified);
  const activeVenues = venues.filter(v => v.isVerified);

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Universal Side Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 bg-neutral-900 border-r border-white/5 flex flex-col justify-between p-6 z-50">
        <div>
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/20">
              <Shield size={22} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase italic">UrbanAdmin</span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'venues', label: 'Pending Approvals', icon: <Building2 size={20} />, count: pendingVenues.length },
              { id: 'users', label: 'User Directory', icon: <Users size={20} /> },
              { id: 'settings', label: 'Platform Settings', icon: <Settings size={20} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                  activeTab === item.id 
                  ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/20' 
                  : 'text-neutral-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="font-bold text-sm tracking-tight">{item.label}</span>
                </div>
                {item.count ? (
                  <span className="w-6 h-6 bg-white text-rose-600 rounded-full flex items-center justify-center text-[10px] font-black">
                    {item.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black text-sm"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>

      <div className="flex-1 ml-64">
        {/* Top Header */}
        <header className="h-24 sticky top-0 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 z-40 px-10 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shadow-xl">
                 <ShieldCheck size={24} />
              </div>
              <div>
                 <h1 className="text-sm font-black uppercase tracking-widest text-neutral-500">Admin Control</h1>
                 <p className="font-bold text-white tracking-tight">{user?.name}</p>
              </div>
           </div>

           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-rose-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-neutral-900 border border-white/5 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-rose-600 transition-all w-80 text-xs font-bold"
              />
           </div>
        </header>

        <main className="p-10">
          <AnimatePresence mode='wait'>
            {activeTab === 'venues' ? (
              <motion.div key="venues" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                 <div className="flex items-end justify-between">
                    <div>
                       <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Audit Queue</h2>
                       <p className="text-neutral-500 text-sm font-bold">{pendingVenues.length} properties awaiting verification</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    {pendingVenues.map((v) => (
                      <div key={v._id} className="bg-neutral-900 border border-white/5 rounded-[40px] p-8 flex items-center justify-between group hover:border-white/20 transition-all">
                         <div className="flex items-center gap-8">
                            <div className="w-28 h-28 rounded-3xl bg-neutral-800 overflow-hidden border border-white/5 relative group">
                               {v.images?.[0] ? (
                                 <img src={v.images[0]} className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-neutral-600 italic text-[10px]">No Thumbnail</div>
                               )}
                            </div>
                            <div>
                               <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-black">{v.name}</h3>
                                  <span className="px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest border border-indigo-500/20">{v.type}</span>
                               </div>
                               <div className="flex gap-6">
                                  <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold">
                                     <MapPin size={14} className="text-rose-600" />
                                     {v.location}
                                  </div>
                                  <div className="flex items-center gap-2 text-neutral-500 text-xs font-bold italic">
                                     Owner: <span className="text-white underline">{v.owner?.name || 'Anonymous'}</span>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="flex gap-4">
                            <button 
                              onClick={() => verifyVenue(v._id)}
                              className="px-8 py-4 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-2xl font-black transition-all flex items-center gap-2"
                            >
                               <ShieldCheck size={18} />
                               Approve
                            </button>
                            <button 
                              onClick={() => deleteVenue(v._id)}
                              className="w-14 h-14 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-red-500/10"
                            >
                               <Trash2 size={20} />
                            </button>
                         </div>
                      </div>
                    ))}

                    {pendingVenues.length === 0 && (
                      <div className="py-40 text-center bg-white/5 rounded-[60px] border border-dashed border-white/10">
                         <Star size={40} className="mx-auto mb-4 text-neutral-700" />
                         <h3 className="text-xl font-bold text-neutral-500 italic">Global Queue Cleared</h3>
                      </div>
                    )}
                 </div>
              </motion.div>
            ) : (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                 <div className="flex items-end justify-between">
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase">Account Directory</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUsers.map((u) => (
                      <div key={u._id} className="bg-neutral-900 border border-white/5 p-8 rounded-[32px] flex items-center justify-between group hover:border-white/10 transition-all shadow-2xl">
                         <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${
                              u.role === 'admin' ? 'bg-rose-600/20 text-rose-500' : 
                              u.role === 'owner' ? 'bg-indigo-600/20 text-indigo-500' : 'bg-emerald-600/20 text-emerald-500'
                            }`}>
                               {u.name?.[0].toUpperCase()}
                            </div>
                            <div>
                               <h3 className="font-bold flex items-center gap-2">
                                  {u.name}
                                  {u.role === 'admin' && <Shield size={12} className="text-rose-500" />}
                               </h3>
                               <p className="text-xs text-neutral-500 font-medium">{u.email}</p>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <button 
                              onClick={() => setSelectedUser(u)}
                              className="w-10 h-10 bg-white/5 hover:bg-indigo-600 hover:text-white text-neutral-500 rounded-xl flex items-center justify-center transition-all"
                            >
                               <Key size={16} />
                            </button>
                            {u.role !== 'admin' && (
                              <button 
                                onClick={() => deleteUser(u._id)}
                                className="w-10 h-10 bg-white/5 hover:bg-red-500 hover:text-white text-neutral-500 rounded-xl flex items-center justify-center transition-all"
                              >
                                 <Trash2 size={16} />
                              </button>
                            )}
                         </div>
                      </div>
                    ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Password Reset Modal (Recovered) */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedUser(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-neutral-900 border border-white/10 p-10 rounded-[40px] w-full max-w-md relative z-10 shadow-2xl">
              <h2 className="text-2xl font-black mb-2 italic uppercase tracking-tighter">Emergency Override</h2>
              <p className="text-neutral-500 text-sm mb-8 font-bold">Resetting credentials for <span className="text-rose-500">{selectedUser.name}</span></p>
              
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">New Administrative Password</label>
                   <input 
                    type="password" 
                    required 
                    placeholder="Enter Secure Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 rounded-2xl p-4 outline-none focus:border-rose-600 transition-all font-bold"
                  />
                </div>
                <button type="submit" className="w-full bg-rose-600 py-4 rounded-2xl font-black text-sm shadow-xl shadow-rose-600/20 active:scale-95 transition-all">
                  AUTHORIZE RESET
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm z-[200] flex items-center justify-center">
           <Loader2 className="animate-spin text-rose-600" size={48} />
        </div>
      )}
    </div>
  );
}

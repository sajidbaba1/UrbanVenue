'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  Trash2, 
  Key, 
  Search, 
  Shield, 
  Mail, 
  Loader2, 
  X,
  LogOut,
  Settings,
  Zap,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');

  // Handle Logout
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user? Action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/users/${selectedUser._id}/password`, 
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Password updated successfully');
      setSelectedUser(null);
      setNewPassword('');
    } catch (err) {
      alert('Failed to update password');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Side Navigation (Cleaned) */}
      <div className="fixed left-0 top-0 h-full w-20 md:w-64 bg-neutral-900 border-r border-white/5 flex flex-col justify-between p-4 z-50">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-12 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="hidden md:block text-xl font-bold tracking-tight">UrbanVenue</span>
          </Link>

          <div className="space-y-2">
            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-rose-600 text-white shadow-xl shadow-rose-600/20">
              <Users />
              <span className="hidden md:block font-bold text-sm">User Directory</span>
            </button>
            <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-neutral-500 hover:bg-white/5 hover:text-white transition-all">
              <Settings />
              <span className="hidden md:block font-bold text-sm">Settings</span>
            </button>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="pl-20 md:pl-64">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-rose-600/20 flex items-center justify-center text-rose-500 border border-rose-500/30">
               <Shield size={20} />
             </div>
             <div>
               <div className="text-sm font-bold">Admin: {user?.name}</div>
               <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">Management Mode</div>
             </div>
          </div>

          <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-rose-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Quick search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 outline-none focus:border-rose-600 transition-all w-80 text-sm"
            />
          </div>
        </header>

        <main className="p-8">
          {/* Core Stats Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-8 rounded-[32px] bg-neutral-900 border border-white/5 flex items-center justify-between group">
              <div>
                <div className="text-3xl font-black mb-1">{users.length}</div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Total Active Users</div>
              </div>
              <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500">
                <Users size={24} />
              </div>
            </div>
            
            <div className="p-8 rounded-[32px] bg-neutral-900 border border-white/5 flex items-center justify-between group">
              <div>
                <div className="text-3xl font-black mb-1">4.8</div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Platform Rating</div>
              </div>
              <div className="w-14 h-14 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500">
                <Star size={24} fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold uppercase tracking-tighter italic">Platform User Directory</h2>
          </div>

          {/* User List Implementation */}
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-rose-500" size={40} />
              </div>
            ) : filteredUsers.map((u) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={u._id}
                className="group bg-neutral-900 border border-white/5 rounded-[40px] p-6 hover:border-white/20 transition-all flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-black/50"
              >
                <div className="flex items-center gap-6 w-full">
                  <div className="w-16 h-16 rounded-full bg-rose-600/10 flex items-center justify-center text-rose-400 font-black text-2xl border border-rose-500/20 shadow-inner">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold">{u.name}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        u.role === 'admin' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 
                        u.role === 'owner' ? 'bg-indigo-600/20 text-indigo-500 border border-indigo-500/30' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500 text-sm italic">
                      <Mail size={14} />
                      {u.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => setSelectedUser(u)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold"
                  >
                    <Key size={16} />
                    Reset
                  </button>
                  <button 
                    onClick={() => deleteUser(u._id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-red-500 text-sm font-bold"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {/* Emergency Reset Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="relative bg-neutral-900 border border-white/10 w-full max-w-md rounded-[50px] p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-600/10 blur-[80px] -z-10" />
              
              <button onClick={() => setSelectedUser(null)} className="absolute top-8 right-8 text-neutral-500 hover:text-white">
                  <X size={28} />
              </button>

              <h3 className="text-3xl font-black mb-2 italic uppercase tracking-tighter">Force Reset</h3>
              <p className="text-neutral-500 text-sm mb-10 leading-relaxed">
                Updating credentials for <span className="text-white font-bold">{selectedUser.name}</span>.
              </p>

              <form onSubmit={updatePassword} className="space-y-6">
                <input 
                  type="password" 
                  required
                  placeholder="New Administrative Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 px-8 outline-none focus:border-rose-600 transition-all font-medium"
                />
                <button type="submit" className="w-full h-16 bg-rose-600 text-white rounded-[24px] font-black hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/30 active:scale-95 text-lg uppercase">
                  Confirm Override
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

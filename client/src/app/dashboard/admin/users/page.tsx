'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Trash2, 
  Key, 
  Search, 
  Shield, 
  Mail, 
  ChevronRight,
  ShieldAlert,
  Loader2,
  X
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');

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
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
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
    <div className="min-h-screen bg-neutral-950 text-white p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-indigo-500 mb-2">
              <ShieldAlert size={20} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Master Admin</span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter">USER MANAGEMENT</h1>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-600 transition-all placeholder:text-neutral-600"
            />
          </div>
        </div>

        {/* User List */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
          ) : filteredUsers.map((u) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={u._id}
              className="group bg-neutral-900 border border-white/5 rounded-[32px] p-6 hover:border-white/20 transition-all flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6 w-full">
                <div className="w-16 h-16 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-400 font-black text-2xl border border-indigo-500/20">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl font-bold">{u.name}</span>
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      u.role === 'admin' ? 'bg-rose-500 text-white' : 
                      u.role === 'owner' ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400'
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
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-bold"
                >
                  <Key size={16} />
                  Reset PWD
                </button>
                <button 
                  onClick={() => deleteUser(u._id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-red-500 text-sm font-bold"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Password Reset Modal */}
        <AnimatePresence>
          {selectedUser && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedUser(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md" 
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-neutral-900 border border-white/10 w-full max-w-md rounded-[40px] p-10 overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] -z-10" />
                <button onClick={() => setSelectedUser(null)} className="absolute top-6 right-6 text-neutral-500 hover:text-white">
                    <X size={24} />
                </button>

                <h3 className="text-2xl font-black mb-2 italic">FORCE RESET PASSWORD</h3>
                <p className="text-neutral-500 text-sm mb-8">Changing password for <span className="text-white font-bold">{selectedUser.name}</span></p>

                <form onSubmit={updatePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">New Secure Password</label>
                    <input 
                      type="password" 
                      required
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-indigo-600 transition-all"
                    />
                  </div>
                  <button type="submit" className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
                    Update Password
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

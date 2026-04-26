'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Star, 
  TrendingUp, 
  Plus, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Wallet,
  Users,
  MapPin,
  Pencil,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('venues');
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/venues/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVenues(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const deleteVenue = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/venues/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVenues(venues.filter(v => v._id !== id));
    } catch (err) {
      alert('Failed to delete venue');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 h-full w-64 bg-neutral-900 border-r border-white/5 flex flex-col justify-between p-6 z-50">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tight tracking uppercase italic">UrbanVenue</span>
          </Link>

          <div className="space-y-2">
            {[
              { id: 'venues', label: 'My Venues', icon: <Building2 size={20} /> },
              { id: 'bookings', label: 'Booking Requests', icon: <Calendar size={20} /> },
              { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={20} /> },
              { id: 'financials', label: 'Financials', icon: <Wallet size={20} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                  activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                  : 'text-neutral-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black text-sm"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 ml-64">
        <header className="h-24 sticky top-0 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 z-40 px-10 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-xl">
                 <Building2 size={24} />
              </div>
              <div>
                 <h1 className="text-sm font-black uppercase tracking-widest text-neutral-500">Welcome back,</h1>
                 <p className="font-black text-2xl tracking-tight leading-none">{user?.name}</p>
              </div>
           </div>

           <Link href="/dashboard/owner/add-venue" className="bg-white text-black px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5">
              <Plus size={18} />
              Add New Venue
           </Link>
        </header>

        <main className="p-10 max-w-6xl">
          {/* Quick Real-time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'Active Venues', value: venues.length, icon: <Building2 />, color: 'text-indigo-500' },
              { label: 'New Bookings', value: '0', icon: <Calendar />, color: 'text-amber-500' },
              { label: 'Avg Rating', value: '4.9', icon: <Star />, color: 'text-rose-500' },
              { label: 'Est. Revenue', value: '₹0', icon: <TrendingUp />, color: 'text-emerald-500' },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-neutral-900 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-indigo-500/10 transition-all duration-500" />
                <div className={`${stat.color} mb-4 scale-125 origin-left`}>{stat.icon}</div>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <section>
            <div className="flex items-center justify-between mb-10">
               <div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase">Your Venue Listings</h2>
                  <p className="text-neutral-500 text-sm font-bold mt-1">Manage and optimize your property visibility</p>
               </div>
               <button className="text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors underline decoration-indigo-500 decoration-2 underline-offset-8">See public view</button>
            </div>

            {loading ? (
               <div className="grid grid-cols-1 gap-6">
                 {[1,2].map(i => <div key={i} className="h-40 rounded-[40px] bg-neutral-900 animate-pulse" />)}
               </div>
            ) : venues.length > 0 ? (
               <div className="grid grid-cols-1 gap-6">
                 {venues.map((venue) => (
                   <motion.div layout key={venue._id} className="group p-8 rounded-[40px] bg-neutral-900 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-white/10 transition-all shadow-2xl">
                      <div className="flex items-center gap-8 w-full">
                         <div className="w-32 h-32 rounded-3xl bg-neutral-800 overflow-hidden border border-white/5 shrink-0 relative group">
                            {venue.images?.[0] ? (
                              <img src={venue.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-700"><Building2 size={40} /></div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <ExternalLink size={20} className="text-white" />
                            </div>
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-2">
                               <h3 className="text-2xl font-black tracking-tight">{venue.name}</h3>
                               {venue.isVerified ? (
                                 <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                                   <ShieldCheck size={10} /> Verified
                                 </span>
                               ) : (
                                 <span className="text-[8px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20">Pending Approval</span>
                               )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm font-bold text-neutral-500">
                               <div className="flex items-center gap-2">
                                  <MapPin size={16} className="text-indigo-500" />
                                  {venue.location}
                               </div>
                               <div className="flex items-center gap-2">
                                  <Users size={16} className="text-indigo-500" />
                                  {venue.capacity} Guests
                               </div>
                               <div className="flex items-center gap-2">
                                  <Star size={16} className="text-amber-500" />
                                  {venue.rating || 'New Listing'}
                               </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                               {venue.amenities?.slice(0, 3).map((a: string) => (
                                 <span key={a} className="text-[10px] bg-white/5 px-2 py-1 rounded-md border border-white/5">{a}</span>
                               ))}
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto">
                         <Link href={`/dashboard/owner/edit-venue/${venue._id}`} className="flex-1 md:flex-none px-6 py-4 bg-white/5 hover:bg-white hover:text-black rounded-2xl font-black text-sm transition-all border border-white/5 flex items-center justify-center gap-2">
                            <Pencil size={18} />
                            Edit
                         </Link>
                         <button onClick={() => deleteVenue(venue._id)} className="w-14 h-14 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-red-500/10 shadow-lg active:scale-90">
                            <Trash2 size={20} />
                         </button>
                      </div>
                   </motion.div>
                 ))}
               </div>
            ) : (
               <div className="py-32 rounded-[50px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6 text-neutral-600">
                    <Building2 size={32} />
                  </div>
                  <h3 className="text-xl font-black scale-y-110 mb-2 uppercase tracking-tighter">No Active Listings</h3>
                  <p className="text-neutral-500 max-w-xs font-bold leading-relaxed px-4">
                    List your first venue to start appearing in customer searches and earning revenue.
                  </p>
               </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

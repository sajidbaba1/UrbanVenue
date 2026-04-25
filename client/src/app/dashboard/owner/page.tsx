'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Plus, 
  MapPin, 
  Users, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  Wallet,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function OwnerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Handle Logout
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const [venues, setVenues] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalVenues: 0, newBookings: 0, avgRating: 0, estRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('venues');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesRes, statsRes] = await Promise.all([
            axios.get('http://localhost:5000/api/venues'),
            axios.get('http://localhost:5000/api/venues/stats/owner')
        ]);

        const myVenues = venuesRes.data.filter((v: any) => v.owner?._id === user?.id || v.owner === user?.id);
        setVenues(myVenues);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const statConfig = [
    { label: 'Active Venues', value: stats.totalVenues, icon: <Building2 />, color: 'text-indigo-500' },
    { label: 'New Bookings', value: stats.newBookings, icon: <Clock />, color: 'text-amber-500' },
    { label: 'Avg Rating', value: stats.avgRating, icon: <Star />, color: 'text-rose-500' },
    { label: 'Est. Revenue', value: `₹${stats.estRevenue.toLocaleString()}`, icon: <BarChart3 />, color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Side Navigation */}
      <div className="fixed left-0 top-0 h-full w-20 md:w-64 bg-neutral-900 border-r border-white/5 flex flex-col justify-between p-4 z-50">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-12 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="hidden md:block text-xl font-bold tracking-tight">UrbanVenue</span>
          </Link>

          <div className="space-y-2">
            {[
              { id: 'venues', label: 'My Venues', icon: <Building2 /> },
              { id: 'bookings', label: 'Booking Requests', icon: <Calendar /> },
              { id: 'analytics', label: 'Analytics', icon: <BarChart3 /> },
              { id: 'payouts', label: 'Financials', icon: <Wallet /> },
              { id: 'settings', label: 'Settings', icon: <Settings /> },
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
                <span className="hidden md:block font-bold text-sm">{item.label}</span>
              </button>
            ))}
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
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-neutral-950/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-500 border border-indigo-500/30">
               <Building2 size={20} />
             </div>
             <div>
               <div className="text-sm font-bold">Welcome back, {user?.name}</div>
               <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">Professional Venue Owner</div>
             </div>
          </div>

          <Link href="/dashboard/owner/add-venue" className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2">
             Add New Venue
             <Plus size={14} />
          </Link>
        </header>

        <main className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {statConfig.map((stat, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-neutral-900 border border-white/5 relative overflow-hidden group">
                <div className={`${stat.color} mb-4`}>{stat.icon}</div>
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Listings Grid */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Your Venue Listings</h2>
              <Link href="/venues" className="text-sm text-neutral-500 hover:text-white transition-colors">See public view</Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-[40px] bg-neutral-900 animate-pulse" />)}
              </div>
            ) : venues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {venues.map((venue) => (
                  <motion.div 
                    key={venue._id}
                    whileHover={{ y: -5 }}
                    className="rounded-[40px] bg-neutral-900 border border-white/5 overflow-hidden group"
                  >
                    <div className="h-48 bg-neutral-800 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-neutral-700">
                        <Building2 size={48} />
                      </div>
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-black uppercase tracking-widest border border-white/10">
                        {venue.type}
                      </div>
                      {venue.isVerified && (
                        <div className="absolute top-4 right-4 text-emerald-500">
                          <CheckCircle2 size={20} fill="currentColor" className="text-black" />
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{venue.name}</h3>
                      <div className="flex items-center gap-2 text-neutral-500 text-sm mb-6">
                        <MapPin size={14} />
                        {venue.location}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1 text-xs font-bold uppercase text-neutral-500 tracking-tighter">
                          <Users size={14} />
                          {venue.capacity} Capacity
                        </div>
                        <div className="text-sm font-black">
                          ₹{venue.pricePerHour}<span className="text-neutral-500 font-medium">/hr</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-neutral-900 rounded-[40px] border-2 border-dashed border-white/10">
                <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-600">
                  <Building2 size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">No venues listed yet</h3>
                <p className="text-neutral-500 mb-8 max-w-sm mx-auto">Start by adding your first event space to begin receiving bookings.</p>
                <Link 
                  href="/dashboard/owner/add-venue" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-neutral-200 transition-all"
                >
                  Create Your First Listing
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

function Star({ size, fill }: { size: number, fill: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

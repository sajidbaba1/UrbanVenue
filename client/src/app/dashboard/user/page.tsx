'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  MapPin, 
  Heart, 
  Calendar, 
  Search,
  ArrowRight,
  LogOut,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bookings');

  // Handle Logout
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Side Navigation */}
      <div className="fixed left-0 top-0 h-full w-20 md:w-64 bg-neutral-900 border-r border-white/5 flex flex-col justify-between p-4 z-50">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-12 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Star size={20} fill="currentColor" />
            </div>
            <span className="hidden md:block text-xl font-bold tracking-tight">UrbanVenue</span>
          </Link>

          <div className="space-y-2">
            {[
              { id: 'bookings', label: 'My Bookings', icon: <Calendar /> },
              { id: 'wishlist', label: 'Wishlist', icon: <Heart /> },
              { id: 'profile', label: 'Profile Settings', icon: <Settings /> },
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
               <User size={20} />
             </div>
             <div>
               <div className="text-sm font-bold">Welcome back, {user?.name}</div>
               <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">Customer Account</div>
             </div>
          </div>

          <Link href="/venues" className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-2">
             Book New Space
             <ArrowRight size={14} />
          </Link>
        </header>

        <main className="p-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Bookings', value: '0', icon: <Calendar />, color: 'text-indigo-500' },
              { label: 'Favorites', value: '0', icon: <Heart />, color: 'text-rose-500' },
              { label: 'KYC Status', value: user?.kycStatus || 'Not Verified', icon: <ShieldCheck />, color: 'text-emerald-500' },
            ].map((stat, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-neutral-900 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-indigo-500/10 transition-all" />
                <div className={`${stat.color} mb-4`}>{stat.icon}</div>
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Section: Dynamic Tab Content */}
          <section>
            <h2 className="text-2xl font-bold mb-8">
              {activeTab === 'bookings' ? 'Your Recent Bookings' : 'Saved Workspaces'}
            </h2>

            {/* Empty State */}
            <div className="py-32 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6 text-neutral-600">
                {activeTab === 'bookings' ? <Calendar size={32} /> : <Heart size={32} />}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {activeTab === 'bookings' ? "No bookings found" : "Your wishlist is empty"}
              </h3>
              <p className="text-neutral-500 max-w-xs mb-8">
                {activeTab === 'bookings' 
                  ? "You haven't booked any spaces yet. Explore premium venues around you."
                  : "Save your favorite venues so you can find them easily later."}
              </p>
              <Link href="/venues" className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-neutral-200 transition-all flex items-center gap-2">
                Explore Venues
                <Search size={18} />
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Zap, 
  Users, 
  Music, 
  UtensilsCrossed, 
  Camera 
} from 'lucide-react';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white fill-current" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">UrbanVenue</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link href="/search" className="hover:text-white transition-colors">Find Venues</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
            <Link href="/list-your-space" className="hover:text-white transition-colors">List Your Space</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">Log In</Link>
            <Link href="/register" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-neutral-200 transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square bg-indigo-600/20 blur-[120px] rounded-full -z-10 opacity-50" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-indigo-400 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Voted #1 Event Platform in 2026
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-8"
          >
            Host the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Perfect</span> Event.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Discover premium wedding halls, party gardens, and rooftop venues. Build custom packages with catering, music, and more—all in one place.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto p-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col md:flex-row items-center gap-2"
          >
            <div className="flex-1 w-full flex items-center gap-4 px-6 h-16 border-b md:border-b-0 md:border-r border-white/10">
              <Search className="text-neutral-500" size={20} />
              <input 
                type="text" 
                placeholder="Where is your event?" 
                className="bg-transparent border-none outline-none text-white placeholder:text-neutral-500 w-full"
              />
            </div>
            <div className="flex-1 w-full flex items-center gap-4 px-6 h-16 border-b md:border-b-0 md:border-r border-white/10">
              <Calendar className="text-neutral-500" size={20} />
              <input 
                type="text" 
                placeholder="Select Date" 
                className="bg-transparent border-none outline-none text-white placeholder:text-neutral-500 w-full"
              />
            </div>
            <button className="w-full md:w-auto px-8 h-16 bg-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-colors">
              <Search size={18} />
              Explore Venues
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Add-ons Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-bold mb-4">Complete Your Package</h2>
              <p className="text-neutral-400">Exclusive add-ons managed directly by our venue partners.</p>
            </div>
            <Link href="/services" className="text-indigo-400 font-bold hover:underline">View All Services</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <UtensilsCrossed size={32} />, name: 'Premium Catering', desc: 'From buffet to fine dining' },
              { icon: <Music size={32} />, name: 'Live DJ & Sound', desc: 'Full stage and party lighting' },
              { icon: <Camera size={32} />, name: 'Photography', desc: 'Capture every golden moment' },
              { icon: <Users size={32} />, name: 'Security & Staff', desc: 'Professional valet and hosts' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-neutral-900 border border-white/10 hover:border-indigo-500/50 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-500 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.name}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden">
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2"><ShieldCheck /> <span className="font-bold">Verified Venues</span></div>
             <div className="flex items-center gap-2"><Star /> <span className="font-bold">4.8+ Avg Rating</span></div>
             <div className="flex items-center gap-2"><Users /> <span className="font-bold">10k+ Successful Events</span></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap size={16} />
              </div>
              <span className="text-xl font-bold">UrbanVenue</span>
            </div>
            <p className="text-neutral-500 max-w-sm mb-8">
              The leading marketplace for discovering and booking premium event spaces. 
              One platform, zero stress.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/legal" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-neutral-500">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/status" className="hover:text-white">Server Status</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

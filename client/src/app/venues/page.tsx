'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Users, 
  Filter, 
  Building2, 
  Star, 
  ArrowRight,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const venueTypes = ['All', 'Marriage Hall', 'Party Garden', 'Conference Room', 'Rooftop', 'Studio'];

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/venues');
        setVenues(res.data);
      } catch (err) {
        console.error('Error fetching venues', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || venue.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-white/5 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by venue name or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 focus:border-indigo-600 outline-none transition-all placeholder:text-neutral-600"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              {venueTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                    selectedType === type 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Explore <span className="text-indigo-500">{selectedType === 'All' ? 'Venues' : selectedType + 's'}</span></h1>
            <p className="text-neutral-500 text-sm">Found {filteredVenues.length} spaces matching your criteria.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-neutral-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <SlidersHorizontal size={16} />
            More Filters
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[1,2,3,4,5,6].map(i => <div key={i} className="h-[400px] rounded-[40px] bg-neutral-900 animate-pulse" />)}
          </div>
        ) : filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filteredVenues.map((venue, index) => (
                <motion.div 
                  key={venue._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  className="group relative rounded-[40px] bg-neutral-900 border border-white/5 overflow-hidden transition-all hover:border-indigo-500/30 shadow-2xl shadow-black/50"
                >
                  {/* Image Placeholder */}
                  <div className="h-64 bg-neutral-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-700 opacity-20 group-hover:scale-110 transition-transform duration-700">
                      <Building2 size={120} />
                    </div>
                    
                    <div className="absolute top-6 left-6 z-20 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                      {venue.type}
                    </div>

                    <div className="absolute bottom-6 left-6 z-20 flex items-center gap-1 text-amber-400">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-black text-white">{venue.rating || '4.5'}</span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold group-hover:text-indigo-400 transition-colors leading-tight">{venue.name}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-black text-white">₹{venue.pricePerHour}</div>
                        <div className="text-[10px] items-center gap-1 font-bold text-neutral-500 uppercase tracking-widest">per hour</div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-neutral-400 text-sm">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:text-indigo-400 transition-colors">
                          <MapPin size={16} />
                        </div>
                        {venue.location}
                      </div>
                      <div className="flex items-center gap-3 text-neutral-400 text-sm">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:text-indigo-400 transition-colors">
                          <Users size={16} />
                        </div>
                        Up to {venue.capacity} Guests
                      </div>
                    </div>

                    <Link 
                      href={`/venues/${venue._id}`}
                      className="w-full h-14 bg-white text-black rounded-2xl font-black group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-white/5"
                    >
                      View Details
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-40 bg-neutral-900/50 rounded-[60px] border border-dashed border-white/5">
             <Search size={64} className="mx-auto mb-6 text-neutral-700" />
             <h2 className="text-2xl font-bold mb-2">No venues match your search</h2>
             <p className="text-neutral-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}

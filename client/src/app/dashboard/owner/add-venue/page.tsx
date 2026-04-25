'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Building2, 
  MapPin, 
  Users, 
  DollarSign, 
  Package, 
  Plus, 
  Trash2, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function AddVenuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    address: '',
    capacity: '',
    pricePerHour: '',
    type: 'Marriage Hall',
    amenities: [] as string[],
    addons: [] as { name: string; price: string; priceType: string }[]
  });

  const amenitiesList = ['WiFi', 'Parking', 'AC', 'Power Backup', 'CCTV', 'Sound System', 'Changing Rooms'];
  const venueTypes = ['Marriage Hall', 'Party Garden', 'Conference Room', 'Rooftop', 'Studio'];

  const handleAddAddon = () => {
    setFormData({
      ...formData,
      addons: [...formData.addons, { name: '', price: '', priceType: 'fixed' }]
    });
  };

  const handleRemoveAddon = (index: number) => {
    const newAddons = [...formData.addons];
    newAddons.splice(index, 1);
    setFormData({ ...formData, addons: newAddons });
  };

  const handleAddonUpdate = (index: number, field: string, value: string) => {
    const newAddons = [...formData.addons];
    newAddons[index] = { ...newAddons[index], [field]: value };
    setFormData({ ...formData, addons: newAddons });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/venues', formData);
      router.push('/dashboard/owner');
    } catch (err) {
      console.error('Failed to create venue', err);
      alert('Error creating venue. Make sure you are logged in as an Owner.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/owner" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">List Your Venue</h1>
            <p className="text-neutral-500">Provide the details to start receiving bookings.</p>
          </div>
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-500">
            <Sparkles size={32} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Building2 size={20} className="text-indigo-500" />
                Venue Details
              </h2>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Venue Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Grand Royal Ballroom"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Venue Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all appearance-none cursor-pointer"
                >
                  {venueTypes.map(t => <option key={t} value={t} className="bg-neutral-900">{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Capacity (Persons)</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input 
                    type="number" 
                    required
                    placeholder="500"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin size={20} className="text-indigo-500" />
                Location
              </h2>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">City / Region</label>
                <input 
                  type="text" 
                  required
                  placeholder="Mumbai, Maharashtra"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Full Address</label>
                <textarea 
                  required
                  placeholder="House No, Landmark, Street..."
                  rows={4}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Ameneties */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-indigo-500" />
              Ameneties Provided
            </h2>
            <div className="flex flex-wrap gap-3">
              {amenitiesList.map(amenity => (
                <div 
                  key={amenity}
                  onClick={() => {
                    const newList = formData.amenities.includes(amenity)
                      ? formData.amenities.filter(a => a !== amenity)
                      : [...formData.amenities, amenity];
                    setFormData({...formData, amenities: newList});
                  }}
                  className={`px-6 py-3 rounded-xl border cursor-pointer transition-all font-medium text-sm flex items-center gap-2 ${
                    formData.amenities.includes(amenity)
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  {formData.amenities.includes(amenity) && <CheckCircle size={14} />}
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Pricing & Add-ons */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign size={24} className="text-indigo-500" />
                Pricing & Packages
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Base Price (Per Hour)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">₹</span>
                    <input 
                      type="number" 
                      required
                      placeholder="5000"
                      value={formData.pricePerHour}
                      onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-8 pr-4 focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="bg-indigo-600/10 rounded-2xl p-4 flex items-start gap-3 border border-indigo-500/20">
                  <Info className="text-indigo-500 mt-1" size={20} />
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Set a competitive base price. Most venue owners also include custom add-on packages to increase their revenue per booking.
                  </p>
                </div>
            </div>

            {/* Dynamic Add-ons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Custom Service Packages</h3>
                <button 
                  type="button"
                  onClick={handleAddAddon}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <Plus size={16} />
                  Add Package
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {formData.addons.map((addon, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 items-end"
                    >
                      <div className="md:col-span-6 space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">Package Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Deluxe Catering (100 Guests)"
                          value={addon.name}
                          onChange={(e) => handleAddonUpdate(index, 'name', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">Price (₹)</label>
                        <input 
                          type="number" 
                          placeholder="0"
                          value={addon.price}
                          onChange={(e) => handleAddonUpdate(index, 'price', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase">Unit</label>
                        <select 
                          value={addon.priceType}
                          onChange={(e) => handleAddonUpdate(index, 'priceType', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm focus:border-indigo-600 outline-none"
                        >
                          <option value="fixed" className="bg-neutral-900">Fixed</option>
                          <option value="per_guest" className="bg-neutral-900">Per Guest</option>
                          <option value="hourly" className="bg-neutral-900">Hourly</option>
                        </select>
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <button 
                          type="button"
                          onClick={() => handleRemoveAddon(index)}
                          className="w-11 h-11 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {formData.addons.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-3xl text-neutral-600">
                    <Package size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No extra service packages added yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-neutral-500 text-sm">
              <span className="text-indigo-400 font-bold">Quick Tip:</span> Venues with at least 2 packages get booked 3x more often.
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto px-12 py-5 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-2xl font-black text-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xl shadow-white/5"
            >
              {loading ? "Publishing..." : "Publish Venue"}
              <ChevronRight size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CheckCircle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

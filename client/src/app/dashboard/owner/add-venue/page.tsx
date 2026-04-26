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
  Info,
  Image as ImageIcon,
  Upload,
  X as CloseIcon
} from 'lucide-react';
import Link from 'next/link';

export default function AddVenuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    address: '',
    capacity: '',
    pricePerHour: '',
    type: 'Marriage Hall',
    amenities: [] as string[],
    addons: [] as { name: string; price: number; priceType: string; description: string }[]
  });

  const amenitiesList = ['WiFi', 'Parking', 'AC', 'Power Backup', 'CCTV', 'Sound System', 'Changing Rooms'];
  const venueTypes = ['Marriage Hall', 'Party Garden', 'Conference Room', 'Rooftop', 'Studio'];

  const addAddon = () => {
    setFormData({
      ...formData,
      addons: [...formData.addons, { name: '', price: 0, priceType: 'fixed', description: '' }]
    });
  };

  const updateAddon = (index: number, field: string, value: any) => {
    const newAddons = [...formData.addons];
    newAddons[index] = { ...newAddons[index], [field]: value };
    setFormData({ ...formData, addons: newAddons });
  };

  const removeAddon = (index: number) => {
    const newAddons = [...formData.addons];
    newAddons.splice(index, 1);
    setFormData({ ...formData, addons: newAddons });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages([...images, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'amenities' || key === 'addons') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value as string);
        }
      });

      images.forEach(image => {
        data.append('images', image);
      });

      await axios.post('http://localhost:5000/api/venues', data, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
      });

      alert('Venue created successfully!');
      router.push('/dashboard/owner');
    } catch (err: any) {
      console.error('Failed to create venue', err);
      const msg = err.response?.data?.message || 'Error creating venue.';
      alert(msg);
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
            <p className="text-neutral-500">Provide the details and upload stunning photos.</p>
          </div>
          <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-500">
            <Sparkles size={32} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Image Upload (NEW) */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400">
              <ImageIcon size={20} />
              Property Gallery
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((src, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-white/10">
                  <img src={src} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white hover:bg-red-500 transition-colors"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
              ))}
              
              {previews.length < 5 && (
                <label className="aspect-[4/3] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 hover:border-indigo-500/50 transition-all group">
                  <Upload className="text-neutral-500 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-xs font-bold text-neutral-500 group-hover:text-white">Upload Photo</span>
                  <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
            </div>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest text-center">Recommended: 1000x600px | Max 5 Images</p>
          </div>

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
                  type="text" required placeholder="Grand Royal Ballroom"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Venue Type</label>
                <select 
                  value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all appearance-none cursor-pointer"
                >
                  {venueTypes.map(t => <option key={t} value={t} className="bg-neutral-900">{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Capacity</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input 
                    type="number" required placeholder="500"
                    value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})}
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
                  type="text" required placeholder="Mumbai, Maharashtra"
                  value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Full Address</label>
                <textarea 
                  required placeholder="House No, Landmark, Street..." rows={4}
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Property Description</label>
             <textarea 
                required placeholder="Give a beautiful description..." rows={4}
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all resize-none"
             />
          </div>

          {/* Section 2: Amenities */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-400">
              <Sparkles size={20} />
              Amenities Provided
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
                  className={`px-6 py-3 rounded-xl border cursor-pointer transition-all font-medium text-sm ${
                    formData.amenities.includes(amenity)
                    ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/10 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Pricing & Add-ons */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-indigo-400">
              <DollarSign size={24} />
              Pricing & Packages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Base Price (Per Hour)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">₹</span>
                    <input 
                      type="number" required placeholder="5000"
                      value={formData.pricePerHour} onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-8 pr-4 focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="bg-indigo-600/10 rounded-2xl p-4 flex items-start gap-3 border border-indigo-500/20 text-sm text-neutral-400">
                  <Info className="text-indigo-500 mt-1 shrink-0" size={20} />
                  Peak hours usually see 20% higher bookings if priced correctly.
                </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold italic underline decoration-indigo-500">Custom Service Packages</h3>
                <button type="button" onClick={addAddon} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all">
                  <Plus size={16} /> Add Package
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                  {formData.addons.map((addon, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white/5 p-6 rounded-[32px] border border-white/10 items-end"
                    >
                      <div className="md:col-span-5 space-y-2">
                        <label className="text-[10px] font-black text-neutral-500 uppercase">Service Name</label>
                        <input type="text" placeholder="e.g. Deluxe Catering"
                          value={addon.name} onChange={(e) => updateAddon(index, 'name', e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-black text-neutral-500 uppercase">Rate (₹)</label>
                        <input type="number" placeholder="0"
                          value={addon.price} onChange={(e) => updateAddon(index, 'price', e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-[10px] font-black text-neutral-500 uppercase">Basis</label>
                        <select value={addon.priceType} onChange={(e) => updateAddon(index, 'priceType', e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 text-sm focus:border-indigo-600 outline-none appearance-none"
                        >
                          <option value="fixed">Fixed</option>
                          <option value="per_guest">Per Guest</option>
                          <option value="hourly">Hourly</option>
                        </select>
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <button type="button" onClick={() => removeAddon(index)} className="w-12 h-12 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full px-16 py-6 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-[24px] font-black text-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xl"
          >
            {loading ? "Publishing Space..." : "Publish Listing"}
            <ChevronRight size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}

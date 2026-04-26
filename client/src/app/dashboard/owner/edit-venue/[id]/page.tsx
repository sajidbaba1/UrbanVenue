'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  X as CloseIcon,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function EditVenuePage() {
  const router = useRouter();
  const params = useParams();
  const venueId = params.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
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

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/venues/${venueId}`);
        const v = res.data;
        setFormData({
            name: v.name,
            description: v.description,
            location: v.location,
            address: v.address,
            capacity: v.capacity.toString(),
            pricePerHour: v.pricePerHour.toString(),
            type: v.type,
            amenities: v.amenities || [],
            addons: v.addons || []
        });
        setPreviews(v.images || []);
      } catch (err) {
        console.error('Failed to fetch venue', err);
        alert('Could not load venue data');
      } finally {
        setLoading(false);
      }
    };
    if (venueId) fetchVenue();
  }, [venueId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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

      // Handle existing images (URLs) vs new images (Files)
      const existingImages = previews.filter(p => p.startsWith('http'));
      data.append('existingImages', JSON.stringify(existingImages));

      images.forEach(image => {
        data.append('images', image);
      });

      await axios.put(`http://localhost:5000/api/venues/${venueId}`, data, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Venue updated successfully!');
      router.push('/dashboard/owner');
    } catch (err: any) {
      console.error('Failed to update venue', err);
      toast.error('Encryption Error: Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center gap-4">
       <Loader2 size={40} className="text-indigo-600 animate-spin" />
       <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Accessing Vault...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/owner" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group font-bold">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Dashboard
        </Link>

        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2 underline decoration-indigo-500 decoration-4">Update Listing</h1>
            <p className="text-neutral-500 font-bold">Refine your property details to maximize bookings.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pb-20">
          {/* Section: Image Upload */}
          <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6 shadow-2xl">
            <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-400 uppercase italic tracking-tighter">
              <ImageIcon size={20} />
              Property Gallery
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((src, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-3xl overflow-hidden group border border-white/10">
                  <img src={src} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-white hover:bg-red-500 transition-colors shadow-xl"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
              ))}
              
              {previews.length < 5 && (
                <label className="aspect-[4/3] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 hover:border-indigo-500/50 transition-all group">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                     <Upload className="text-neutral-500 group-hover:text-white" size={20} />
                  </div>
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest group-hover:text-white">Add Photo</span>
                  <input type="file" multiple className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-4 text-indigo-400">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center"><Building2 size={16} /></div>
                Core Specs
              </h2>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">Venue Identity</label>
                <input 
                  type="text" required placeholder="Name"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">Space Categorization</label>
                <select 
                  value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all appearance-none cursor-pointer font-bold"
                >
                  {venueTypes.map(t => <option key={t} value={t} className="bg-neutral-900">{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">Guest Threshold</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input 
                    type="number" required placeholder="Capacity"
                    value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full bg-neutral-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-600 outline-none transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-4 text-indigo-400">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center"><MapPin size={16} /></div>
                Geo-Location
              </h2>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">City / Hub</label>
                <input 
                  type="text" required placeholder="Location"
                  value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">Physical Address</label>
                <textarea 
                  required placeholder="Address" rows={4}
                  value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all resize-none font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">Marketing Narrative</label>
             <textarea 
                required placeholder="Description" rows={4}
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 focus:border-indigo-600 outline-none transition-all resize-none font-bold text-sm"
             />
          </div>

          {/* Section 2: Amenities */}
          <div className="p-8 rounded-[40px] bg-white/5 border border-white/10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-4 text-indigo-400 uppercase italic tracking-tighter">
              <Sparkles size={20} />
              Infrastructure
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
                  className={`px-8 py-3 rounded-2xl border cursor-pointer transition-all font-black text-[10px] uppercase tracking-widest ${
                    formData.amenities.includes(amenity)
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-black/40 border-white/5 text-neutral-500 hover:border-white/20'
                  }`}
                >
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Pricing & Add-ons */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-indigo-400">Yield Configuration</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest pl-1">Standard Hourly Rate</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-black italic">₹</span>
                    <input 
                      type="number" required 
                      value={formData.pricePerHour} onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                      className="w-full bg-neutral-900 border border-white/5 rounded-2xl py-4 pl-10 pr-4 focus:border-indigo-600 outline-none transition-all font-black"
                    />
                  </div>
                </div>
                <div className="bg-indigo-600/10 rounded-3xl p-6 flex items-start gap-4 border border-indigo-500/20">
                  <Info className="text-indigo-500 mt-1 shrink-0" size={20} />
                  <p className="text-xs font-bold text-neutral-400 leading-relaxed italic">
                    Note: Updating your pricing will not affect already confirmed bookings, but will apply to all future reservations.
                  </p>
                </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase italic tracking-tighter underline">Premium Add-on Bundles</h3>
                <button type="button" onClick={addAddon} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-indigo-400 transition-all uppercase tracking-widest">
                  <Plus size={16} /> Update Stack
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                  {formData.addons.map((addon, index) => (
                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-black/40 p-6 rounded-[32px] border border-white/5 items-end shadow-xl"
                    >
                      <div className="md:col-span-5 space-y-2">
                        <label className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Label</label>
                        <input type="text" placeholder="e.g. Premium Catering"
                          value={addon.name} onChange={(e) => updateAddon(index, 'name', e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 text-xs font-bold focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Rate (₹)</label>
                        <input type="number" 
                          value={addon.price} onChange={(e) => updateAddon(index, 'price', e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 text-xs font-bold focus:border-indigo-600 outline-none"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Basis</label>
                        <select value={addon.priceType} onChange={(e) => updateAddon(index, 'priceType', e.target.value)}
                          className="w-full bg-neutral-900 border border-white/5 rounded-2xl p-4 text-xs font-bold focus:border-indigo-600 outline-none"
                        >
                          <option value="fixed">Fixed Rate</option>
                          <option value="per_guest">Per Head</option>
                          <option value="hourly">Hourly</option>
                        </select>
                      </div>
                      <div className="md:col-span-1 flex justify-end">
                        <button type="button" onClick={() => removeAddon(index)} className="w-12 h-12 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-red-500/10 active:scale-90">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
             <button 
                type="submit" disabled={saving}
                className="w-full py-6 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-[32px] font-black text-xl italic uppercase tracking-tighter transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
              >
                {saving ? "Saving Updates..." : "Save Changes"}
                <ChevronRight size={24} />
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import { User, Mail, Lock, Zap, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer' as 'customer' | 'owner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(res.data.token, res.data.user);
      
      const role = res.data.user.role;
      if (role === 'admin') router.push('/dashboard/admin/users');
      else if (role === 'owner') router.push('/dashboard/owner');
      else router.push('/dashboard/user');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex">
      {/* Left: Branding & Info */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-indigo-600 p-16 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-800" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:40px_40px]" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white mb-20">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <Zap className="fill-current" size={20} />
            </div>
            <span className="text-2xl font-bold tracking-tight">UrbanVenue</span>
          </Link>

          <h1 className="text-6xl font-black text-white leading-tight mb-8">
            The platform for <br />
            <span className="text-indigo-200">Creative</span> Spaces.
          </h1>

          <div className="space-y-6">
            {[
              "Reach thousands of event planners",
              "Manage add-ons like catering & DJ",
              "Secure, verified transaction flow",
              "Powerful analytics dashboard"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-white/80">
                <CheckCircle2 className="text-indigo-300" size={20} />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/50 text-sm">
          © 2026 UrbanVenue Technologies. All rights reserved.
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
            <p className="text-neutral-500">Join the community and start hosting or booking.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div 
                onClick={() => setFormData({...formData, role: 'customer'})}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.role === 'customer' 
                  ? 'bg-indigo-600/10 border-indigo-600 text-white' 
                  : 'bg-white/5 border-white/10 text-neutral-500 hover:border-white/20'
                }`}
              >
                <div className="text-sm font-bold mb-1">Customer</div>
                <div className="text-[10px] opacity-60 uppercase tracking-wider">I want to book</div>
              </div>
              <div 
                onClick={() => setFormData({...formData, role: 'owner'})}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.role === 'owner' 
                  ? 'bg-indigo-600/10 border-indigo-600 text-white' 
                  : 'bg-white/5 border-white/10 text-neutral-500 hover:border-white/20'
                }`}
              >
                <div className="text-sm font-bold mb-1">Venue Owner</div>
                <div className="text-[10px] opacity-60 uppercase tracking-wider">I want to list</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-indigo-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-indigo-600 focus:bg-indigo-600/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-indigo-600 focus:bg-indigo-600/5 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-neutral-600 focus:border-indigo-600 focus:bg-indigo-600/5 outline-none transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <p className="text-center text-sm text-neutral-500">
              Already have an account? <Link href="/login" className="text-indigo-400 font-bold hover:underline">Log in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

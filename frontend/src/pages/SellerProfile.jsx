import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, User, Image as ImageIcon, Briefcase, Handshake, Globe, MapPin, Award } from "lucide-react";
import api from "../api/axios";

const SellerProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await api.get(`/auth/seller/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeller();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex justify-center items-center">
         <div className="w-12 h-12 border-4 border-[var(--border-glass)] border-t-[var(--accent-gold)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data?.seller) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col justify-center items-center text-center px-4">
         <h2 className="text-3xl font-bold text-[var(--text-main)] outfit-font mb-4">Identity Not Ascertained</h2>
         <p className="text-[var(--text-muted)] mb-8">This collector's portfolio is currently unlisted or their verification was revoked.</p>
         <Link to="/store" className="btn btn--gold rounded-full px-8">Return to The Vault</Link>
      </div>
    );
  }

  const { seller, products } = data;

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-28 pb-20">
      <div className="wrap max-w-6xl">
        
        {/* Profile Identity Card */}
        <div className="glass-card bg-[var(--bg-card)] p-8 md:p-12 mb-12 relative overflow-hidden border border-[var(--border-glass)] shadow-2xl">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--accent-gold)]/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-dark)] p-1.5 shadow-[0_0_40px_rgba(var(--gold-rgb),0.3)] shrink-0 group">
              <img 
                src={seller?.avatar?.startsWith('http') ? seller.avatar : `http://localhost:5001${seller?.avatar || '/uploads/default-avatar.png'}`} 
                alt={seller.name} 
                className="w-full h-full object-cover rounded-full bg-[var(--bg-black)]/50 group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${seller.name}&background=d4af37&color=000&size=200` }}
              />
            </div>
            
            <div className="text-center md:text-left flex-1 border-b border-[var(--border-glass)] md:border-b-0 pb-6 md:pb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-main)] outfit-font mb-3 tracking-tight">{seller.name}</h1>
              <p className="text-[var(--text-muted)] text-sm mb-6 flex items-center justify-center md:justify-start gap-2">
                 <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)]" /> Verified Independent Collector
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-[var(--bg-black)]/40 border border-[var(--border-glass)] rounded-xl px-5 py-3 text-center min-w-[120px]">
                   <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Active Artifacts</p>
                   <p className="text-2xl font-mono text-[var(--text-main)]">{products.length}</p>
                </div>
                <div className="bg-[var(--bg-black)]/40 border border-[var(--border-glass)] rounded-xl px-5 py-3 text-center min-w-[120px]">
                   <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Join Date</p>
                   <p className="text-xl font-medium text-[var(--text-main)]">{new Date(seller.createdAt).getFullYear()}</p>
                </div>
                <div className="bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 rounded-xl px-5 py-3 text-center min-w-[120px] shadow-[inset_0_0_20px_rgba(var(--gold-rgb),0.1)]">
                   <p className="text-xs uppercase tracking-widest text-[var(--accent-gold)] font-bold mb-1">Curation Grade</p>
                   <p className="text-2xl font-mono text-[var(--accent-gold)] flex items-center justify-center gap-1.5"><Award className="w-5 h-5"/> A+</p>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 hidden lg:flex flex-col gap-3 justify-center text-xs text-[var(--text-muted)] border-l border-[var(--border-glass)] pl-10 h-32">
               <span className="flex items-center gap-2 decoration-transparent"><Globe className="w-4 h-4"/> Global Sourcing Network</span>
               <span className="flex items-center gap-2 decoration-transparent"><Handshake className="w-4 h-4"/> Certified Escrow Trust</span>
               <span className="flex items-center gap-2 decoration-transparent"><Briefcase className="w-4 h-4"/> Private Bidding Enabled</span>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="mb-8 flex items-center gap-4">
           <h2 className="text-2xl font-bold text-[var(--text-main)] outfit-font">Current Portfolio</h2>
           <div className="h-px bg-[var(--border-glass)] flex-1"></div>
        </div>

        {products.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-16 text-center shadow-inner">
            <ImageIcon className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
            <h3 className="text-xl text-[var(--text-main)] font-semibold mb-2">No Artifacts Available</h3>
            <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">This collector's portfolio is currently empty. Their assets may have been fully liquidated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="glass-card bg-[var(--bg-card)] border-[var(--border-glass)] overflow-hidden flex flex-col group hover:border-[var(--accent-gold)]/50 transition-colors">
                <div className="relative aspect-square bg-[var(--bg-black)]/50 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 bg-[var(--bg-black)]/60 backdrop-blur px-2.5 py-1 rounded text-[10px] font-bold text-[var(--text-main)] uppercase tracking-wider border border-[var(--border-glass)]">
                    {product.category}
                  </div>
                  <img 
                    src={product.images[0]?.startsWith('http') ? product.images[0] : `http://localhost:5001${product.images[0]}`} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-5 flex-1 flex flex-col relative z-20">
                  <h3 className="text-[var(--text-main)] font-semibold line-clamp-2 leading-snug mb-3 group-hover:text-[var(--accent-gold)] transition-colors">
                    {product.title}
                  </h3>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="font-mono font-bold text-[var(--text-main)] text-lg">${product.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
};

export default SellerProfile;

import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Globe, Instagram, Twitter, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-[var(--border-glass)] pt-12 sm:pt-16 pb-8 text-[var(--text-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          
          {/* Brand Col */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-dark)] flex items-center justify-center">
                <span className="text-[var(--text-black)] font-black outfit-font text-lg tracking-tighter">FV</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight outfit-font">
                Forge<span className="font-light text-[var(--text-muted)]">Vogue</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4 sm:mb-6">
              The premier destination to acquire and liquidate the world's most sought-after authenticated collectibles.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <a href="https://instagram.com/asmit.kumar05" target="_blank" rel="noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--glass-light)] border border-[var(--border-glass)] flex items-center justify-center hover:bg-[var(--accent-gold)] hover:text-[var(--text-black)] transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--glass-light)] border border-[var(--border-glass)] flex items-center justify-center hover:bg-[var(--accent-gold)] hover:text-[var(--text-black)] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="mailto:asmitk983@gmail.com" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--glass-light)] border border-[var(--border-glass)] flex items-center justify-center hover:bg-[var(--accent-gold)] hover:text-[var(--text-black)] transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* The Vault */}
          <div>
            <h4 className="text-[var(--text-main)] font-semibold mb-4 sm:mb-6 outfit-font tracking-wide text-sm sm:text-base">The Vault</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li><Link to="/store?category=Rare%20Sneakers" className="hover:text-[var(--accent-gold)] transition-colors">Rare Sneakers</Link></li>
              <li><Link to="/store?category=Classic%20Watches" className="hover:text-[var(--accent-gold)] transition-colors">Classic Horology</Link></li>
              <li><Link to="/store?category=Vintage%20Books" className="hover:text-[var(--accent-gold)] transition-colors">Vintage Literature</Link></li>
              <li><Link to="/store?category=Limited%20Edition%20Art" className="hover:text-[var(--accent-gold)] transition-colors">Contemporary Art</Link></li>
              <li><Link to="/store?category=Signed%20Memorabilia" className="hover:text-[var(--accent-gold)] transition-colors">Signed Memorabilia</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[var(--text-main)] font-semibold mb-4 sm:mb-6 outfit-font tracking-wide text-sm sm:text-base">Platform</h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li><Link to="/store" className="hover:text-[var(--accent-gold)] transition-colors">The Collection</Link></li>
              <li><Link to="/journal" className="hover:text-[var(--accent-gold)] transition-colors">The Journal</Link></li>
              <li><Link to="/sell" className="hover:text-[var(--accent-gold)] transition-colors">Liquidate Assets</Link></li>
              <li><Link to="/about" className="hover:text-[var(--accent-gold)] transition-colors">Trust & Process</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[var(--text-main)] font-semibold mb-4 sm:mb-6 outfit-font tracking-wide text-sm sm:text-base">Contact</h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                <span className="text-[var(--text-main)] font-medium">Asmit Kumar</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                <a href="tel:+916201817713" className="hover:text-[var(--accent-gold)] transition-colors">+91 6201817713</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                <a href="mailto:asmitk983@gmail.com" className="hover:text-[var(--accent-gold)] transition-colors">asmitk983@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                <a href="https://instagram.com/asmit.kumar05" target="_blank" rel="noreferrer" className="hover:text-[var(--accent-gold)] transition-colors">@asmit.kumar05</a>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 sm:pt-8 border-t border-[var(--border-glass)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-xs">
          <p>© {new Date().getFullYear()} ForgeVogue Marketplace · Founded by Asmit Kumar. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-[var(--text-main)] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[var(--text-main)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
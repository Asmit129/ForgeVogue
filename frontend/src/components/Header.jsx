import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import { Search, ShoppingBag, User, LogOut, ShieldCheck, Tag, Sun, Moon, Bell, X, Menu, Package, Handshake, MessageSquare, Star } from "lucide-react";
import api from "../api/axios";

const Header = () => {
  const { user, logout } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllRead, markOneRead } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setNotifOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Search debounce
  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/products/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data || []);
      } catch { setSearchResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const getNotifIcon = (type) => {
    switch (type) {
      case "order": return <Package className="w-4 h-4 text-green-400 shrink-0" />;
      case "offer": return <Handshake className="w-4 h-4 text-blue-400 shrink-0" />;
      case "inquiry": return <MessageSquare className="w-4 h-4 text-purple-400 shrink-0" />;
      case "product": return <Star className="w-4 h-4 text-yellow-400 shrink-0" />;
      default: return <Bell className="w-4 h-4 text-[var(--text-muted)] shrink-0" />;
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
      scrolled 
        ? "bg-[var(--bg-main)]/90 backdrop-blur-xl border-[var(--border-glass)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
        : "bg-transparent border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        
        {/* BRAND */}
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[var(--text-soft)] mr-2">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <img src="/logo.png" alt="FV" className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded-full shadow-[0_0_10px_rgba(var(--gold-rgb),0.4)]" />
            <span className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight outfit-font">
              Forge<span className="font-light text-[var(--text-soft)]">Vogue</span>
            </span>
          </Link>
        </div>

        {/* NAV LINKS (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {[
            { path: "/", label: "Vault Entrance" },
            { path: "/store", label: "The Collection" },
            { path: "/about", label: "Trust & Process" },
            { path: "/journal", label: "The Journal" },
          ].map((link) => (
            <Link key={link.path} to={link.path}
              className={`text-sm font-medium transition-colors hover:text-[var(--accent-gold)] ${location.pathname === link.path ? 'text-[var(--accent-gold)]' : 'text-[var(--text-soft)]'}`}>
              {link.label}
            </Link>
          ))}
          <div className="w-px h-5 bg-[var(--glass-heavy)] mx-1"></div>
          <Link to="/sell" className="flex items-center gap-1.5 text-sm font-semibold text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)] transition-colors">
            <Tag className="w-4 h-4" /> Liquidate
          </Link>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={toggleTheme} className="relative text-[var(--text-soft)] hover:text-[var(--text-main)] transition-all transform hover:-translate-y-0.5 active:scale-95 group" aria-label="Toggle Theme">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--glass-light)] flex items-center justify-center group-hover:bg-[var(--text-main)]/10 transition-colors shadow-sm">
              {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
          </button>

          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button onClick={() => setSearchOpen(!searchOpen)} className="relative text-[var(--text-soft)] hover:text-[var(--text-main)] transition-all transform hover:-translate-y-0.5 active:scale-95 group" aria-label="Search">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--glass-light)] flex items-center justify-center group-hover:bg-[var(--text-main)]/10 transition-colors shadow-sm">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-10 w-72 sm:w-80 bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-[var(--border-glass)]">
                  <input type="text" autoFocus placeholder="Search artifacts..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && searchQuery) { navigate(`/store?search=${searchQuery}`); setSearchOpen(false); }}}
                    className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none placeholder-[var(--text-muted)]"
                  />
                </div>
                {searchResults.length > 0 && (
                  <div className="max-h-64 overflow-y-auto">
                    {searchResults.map((p) => (
                      <Link key={p._id} to={`/product/${p._id}`} onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-[var(--glass-light)] transition-colors">
                        <img src={p.images?.[0]?.startsWith('http') ? p.images[0] : `http://localhost:5001${p.images?.[0]}`}
                          alt="" className="w-10 h-10 rounded object-cover border border-[var(--border-glass)]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-main)] truncate">{p.title}</p>
                          <p className="text-xs text-[var(--accent-gold)] font-mono">₹{p.price?.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div className="p-4 text-center text-sm text-[var(--text-muted)]">No artifacts found</div>
                )}
              </div>
            )}
          </div>

          {/* Notifications */}
          {user && (
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setDropdownOpen(false); }}
                className="relative text-[var(--accent-gold)] transition-all transform hover:-translate-y-0.5 active:scale-95 group" aria-label="Notifications">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--accent-gold)]/15 flex items-center justify-center border border-[var(--accent-gold)]/30 group-hover:bg-[var(--accent-gold)]/30 transition-colors shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 shadow-sm" />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[var(--bg-main)] shadow-md">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden">
                  <div className="p-3 border-b border-[var(--border-glass)] flex justify-between items-center">
                    <span className="text-sm font-semibold text-[var(--text-main)]">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] uppercase tracking-wider text-[var(--accent-gold)] font-bold hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-[var(--text-muted)]">No notifications yet</div>
                    ) : (
                      notifications.slice(0, 15).map((notif) => (
                        <Link key={notif._id} to={notif.link || "#"}
                          onClick={() => { markOneRead(notif._id); setNotifOpen(false); }}
                          className={`flex items-start gap-3 p-3 border-b border-[var(--border-glass)] hover:bg-[var(--glass-light)] transition-colors ${!notif.isRead ? "bg-[var(--accent-gold)]/5" : ""}`}>
                          {getNotifIcon(notif.type)}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-relaxed ${!notif.isRead ? "text-[var(--text-main)] font-medium" : "text-[var(--text-muted)]"}`}>
                              {notif.message}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-1">
                              {new Date(notif.createdAt).toLocaleDateString()} · {new Date(notif.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          {!notif.isRead && <div className="w-2 h-2 rounded-full bg-[var(--accent-gold)] shrink-0 mt-1"></div>}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Account */}
          <div className="relative">
            {user ? (
              <button onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-[var(--glass-medium)] border border-[var(--border-glass-strong)] flex items-center justify-center overflow-hidden">
                  <User className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <span className="text-sm font-medium hidden lg:block">{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors">
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {dropdownOpen && user && (
              <div className="absolute right-0 mt-3 w-48 bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] py-2 z-50">
                <div className="px-4 py-2 border-b border-[var(--border-glass)] mb-2">
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Account</p>
                  <p className="text-sm font-semibold text-[var(--text-main)] truncate">{user.name}</p>
                </div>
                {user.isAdmin && (
                  <Link to="/admin" onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--accent-gold)] hover:bg-[var(--glass-light)] transition-colors">
                    <ShieldCheck className="w-4 h-4" /> Vault Command
                  </Link>
                )}
                <Link to="/profile" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[var(--text-soft)] hover:bg-[var(--glass-light)] hover:text-[var(--text-main)] transition-colors">
                  My Collection
                </Link>
                <Link to="/my-orders" onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-[var(--text-soft)] hover:bg-[var(--glass-light)] hover:text-[var(--text-main)] transition-colors">
                  Order History
                </Link>
                <div className="border-t border-[var(--border-glass)] mt-2 pt-2">
                  <button onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-[var(--glass-light)] transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <button onClick={() => setIsCartOpen(true)} className="relative text-[var(--text-soft)] hover:text-[var(--text-main)] transition-all transform hover:-translate-y-0.5 active:scale-95 group" aria-label="Cart">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--glass-light)] flex items-center justify-center group-hover:bg-[var(--accent-gold)]/20 transition-colors shadow-sm">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-[var(--accent-gold)]" />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--accent-gold)] text-[var(--text-black)] text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[var(--bg-main)]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Nav Full Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-main)] border-t border-[var(--border-glass)] px-6 py-4 space-y-3 shadow-xl">
          {[
            { path: "/", label: "Vault Entrance" },
            { path: "/store", label: "The Collection" },
            { path: "/journal", label: "The Journal" },
            { path: "/about", label: "Trust & Process" },
          ].map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)}
              className={`block text-sm font-medium py-2 ${location.pathname === link.path ? 'text-[var(--accent-gold)]' : 'text-[var(--text-soft)]'}`}>
              {link.label}
            </Link>
          ))}
          <Link to="/sell" onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold py-2 text-[var(--accent-gold)]">
            <Tag className="w-4 h-4 inline mr-2" /> Liquidate Item
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ShieldCheck, PackageOpen, Users, LogOut, CheckCircle, XCircle, Clock, Trash2, ArrowRight, Handshake, Headset, MessageSquare, Check, TrendingUp, DollarSign, Activity, BarChart2, BookOpen, Tag } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import api from "../api/axios";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("analytics"); // 'analytics', 'products', 'orders', 'users', 'offers', 'inquiries'
  const [loading, setLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [allOffers, setAllOffers] = useState([]);
  const [allInquiries, setAllInquiries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [articles, setArticles] = useState([]);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [articleForm, setArticleForm] = useState({ title: "", slug: "", author: "ForgeVogue Editorial", coverImage: "", excerpt: "", content: "", readTime: 5 });
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({ code: "", discountType: "percentage", value: 10, minOrder: 0, maxUses: 100, expiresAt: "" });

  // Product Filters
  const [productFilter, setProductFilter] = useState("pending");

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "analytics") {
        const res = await api.get("/orders/admin/analytics");
        setAnalytics(res.data);
      } else if (activeTab === "products") {
        const res = await api.get("/products/admin/all");
        setProducts(res.data);
      } else if (activeTab === "orders") {
        const res = await api.get("/orders/admin/all");
        setOrders(res.data);
      } else if (activeTab === "offers") {
        const res = await api.get("/offers/admin/all");
        setAllOffers(res.data);
      } else if (activeTab === "users") {
        const res = await api.get("/auth/users");
        setUsers(res.data);
      } else if (activeTab === "inquiries") {
        const res = await api.get("/inquiries/admin/all");
        setAllInquiries(res.data);
      } else if (activeTab === "journal") {
        const res = await api.get("/articles");
        setArticles(res.data);
      } else if (activeTab === "coupons") {
        const res = await api.get("/coupons");
        setCoupons(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Product Handlers ---
  const handleVerify = async (id) => {
    try {
      if(window.confirm("Approve and list this item on the marketplace?")) {
        await api.put(`/products/admin/${id}/verify`, { status: "verified", adminNotes: "Verified authentic." });
        fetchData();
      }
    } catch (error) {
      alert("Failed to verify product.");
    }
  };

  const handleReject = async (id) => {
    try {
      const notes = window.prompt("Reason for rejection (e.g., Inauthentic, Poor Condition):");
      if (notes !== null) {
        await api.put(`/products/admin/${id}/verify`, { status: "rejected", adminNotes: notes });
        fetchData();
      }
    } catch (error) {
      alert("Failed to reject product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Permanently delete this item record?")) {
      try {
        await api.delete(`/products/admin/${id}`);
        fetchData();
      } catch (error) {
        alert("Failed to delete product.");
      }
    }
  };

  // --- Order Handlers ---
  const handleUpdateOrder = async (id, isPaid, isDelivered) => {
    try {
      await api.put(`/orders/admin/${id}`, { isPaid, isDelivered });
      fetchData();
    } catch (error) {
      alert("Failed to update order status.");
    }
  };

  // --- Inquiry Handlers ---
  const handleAdminReply = async (id, currentStatus) => {
    const reply = window.prompt("Enter official Concierge response (This will mark inquiry as Resolved):");
    if (reply !== null && reply.trim() !== "") {
      try {
        await api.put(`/inquiries/admin/${id}`, { status: "Resolved", adminReply: reply });
        fetchData();
      } catch (err) {
        alert("Failed to transmit official response.");
      }
    }
  };

  // --- Article Handlers ---
  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      await api.post("/articles", articleForm);
      setShowArticleModal(false);
      setArticleForm({ title: "", slug: "", author: "ForgeVogue Editorial", coverImage: "", excerpt: "", content: "", readTime: 5 });
      fetchData();
    } catch (error) {
      alert("Failed to publish article. " + (error.response?.data?.message || ""));
    }
  };

  const handleOfferStatus = async (id, status) => {
    if (window.confirm(`Are you sure you want to mark this offer as ${status}?`)) {
      try {
        await api.put(`/offers/${id}/status`, { status });
        fetchData();
      } catch (error) {
        alert("Failed to update system offer status.");
      }
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6 text-center">
        <div>
          <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold text-[var(--text-main)] mb-4 outfit-font">Security Clearance Denied</h2>
          <p className="text-[var(--text-muted)] max-w-md mx-auto mb-8">This portal is strictly restricted to ForgeVogue System Administrators.</p>
          <Link to="/" className="btn btn--gold rounded-full px-8">Return to Vault</Link>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p => productFilter === "all" || p.status === productFilter);

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-[var(--border-glass)] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[var(--accent-gold)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-main)] outfit-font">Command Center</h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">System Administrator Portal</p>
            </div>
          </div>
          <div className="flex bg-[var(--bg-card)] p-1.5 rounded-2xl border border-[var(--border-glass)] overflow-x-auto hide-scrollbar max-w-full">
            {[
              { id: 'analytics', icon: Activity, label: 'Terminal' },
              { id: 'products', icon: PackageOpen, label: 'Asset Intake' },
              { id: 'orders', icon: ShieldCheck, label: 'Escrow Ledger' },
              { id: 'offers', icon: Handshake, label: 'Binding Offers' },
              { id: 'inquiries', icon: Headset, label: 'Concierge Desk' },
              { id: 'journal', icon: BookOpen, label: 'Editorial CMS' },
              { id: 'coupons', icon: Tag, label: 'Promo Codes' },
              { id: 'users', icon: Users, label: 'Collector Network' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? "bg-[var(--accent-gold)] text-[var(--text-black)] shadow-[0_4px_15px_rgba(var(--gold-rgb),0.2)]" 
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-light)]"
                }`}
              >
                <tab.icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-12 h-12 border-4 border-[var(--border-glass)] border-t-[var(--accent-gold)] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="glass-card bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl overflow-hidden min-h-[500px]">
            
            {/* ANALYTICS TERMINAL TAB */}
            {activeTab === "analytics" && analytics && (
              <div className="p-6 md:p-8 space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-2xl p-6 shadow-inner relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--accent-gold)]/10 rounded-full blur-2xl group-hover:bg-[var(--accent-gold)]/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-[var(--bg-black)] rounded-xl border border-[var(--border-glass)]">
                        <DollarSign className="w-6 h-6 text-[var(--accent-gold)]" />
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full"><TrendingUp className="w-3 h-3"/> +12.5%</span>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Total Escrow Volume</p>
                    <h3 className="text-3xl font-mono font-bold text-[var(--text-main)]">₹{analytics.totalVolume?.toLocaleString()}</h3>
                  </div>

                  <div className="bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-2xl p-6 shadow-inner relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-[var(--bg-black)] rounded-xl border border-[var(--border-glass)]">
                        <Activity className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Total Transactions</p>
                    <h3 className="text-3xl font-mono font-bold text-[var(--text-main)]">{analytics.totalTransactions?.toLocaleString()}</h3>
                  </div>

                  <div className="bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-2xl p-6 shadow-inner relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-[var(--bg-black)] rounded-xl border border-[var(--border-glass)]">
                        <BarChart2 className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Platform Commission (8%)</p>
                    <h3 className="text-3xl font-mono font-bold text-[var(--accent-gold)]">₹{analytics.totalRevenue?.toLocaleString()}</h3>
                  </div>
                </div>

                {/* Main Trailing Chart */}
                <div className="bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-2xl p-6 shadow-inner">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[var(--text-main)] outfit-font flex items-center gap-2"><Activity className="w-5 h-5 text-[var(--accent-gold)]"/> 30-Day Escrow Trailing Volume</h3>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="_id" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                          itemStyle={{ color: '#d4af37', fontWeight: 'bold' }}
                          formatter={(value) => [`$${value.toLocaleString()}`, 'Escrow Volume']}
                          labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                        />
                        <Area type="monotone" dataKey="Volume" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
              <div>
                <div className="bg-[var(--bg-black)]/40 p-4 border-b border-[var(--border-glass)] flex gap-2 overflow-x-auto hide-scrollbar">
                  {[
                    { id: 'pending', label: 'Requires Authentication', color: 'text-yellow-500' },
                    { id: 'verified', label: 'Verified & Active', color: 'text-green-400' },
                    { id: 'rejected', label: 'Rejected', color: 'text-red-400' },
                    { id: 'all', label: 'All Records', color: 'text-[var(--text-main)]' }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setProductFilter(filter.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                        productFilter === filter.id 
                          ? `bg-[var(--glass-medium)] border-[var(--border-glass-strong)] ${filter.color}` 
                          : "bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text-soft)]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-[var(--text-soft)]">
                    <thead className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-black)]/20 border-b border-[var(--border-glass)]">
                      <tr>
                        <th className="px-6 py-4 font-medium">Asset Details</th>
                        <th className="px-6 py-4 font-medium">Valuation</th>
                        <th className="px-6 py-4 font-medium">Originator</th>
                        <th className="px-6 py-4 font-medium">Status / Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded bg-[var(--bg-black)]/50 border border-[var(--border-glass)] overflow-hidden shrink-0">
                                <img src={p.images[0]?.startsWith('http') ? p.images[0] : `http://localhost:5001${p.images[0]}`} alt="" className="w-full h-full object-cover"/>
                              </div>
                              <div className="min-w-[200px] max-w-[300px]">
                                <p className="text-[var(--text-main)] font-medium line-clamp-1">{p.title}</p>
                                <p className="text-xs text-[var(--text-muted)]">{p.category} • {p.rarity}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono font-medium text-[var(--accent-gold)] whitespace-nowrap">
                            ${p.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <span className="truncate block max-w-[120px]">{p.seller?.name || "Unknown"}</span>
                          </td>
                          <td className="px-6 py-4">
                            {p.status === 'pending' ? (
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleVerify(p._id)} className="w-8 h-8 rounded-full bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center transition-colors" title="Verify & Publish">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleReject(p._id)} className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center transition-colors" title="Reject">
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded inline-flex items-center gap-1 ${p.status === 'verified' ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'}`}>
                                  {p.status === 'verified' ? <ShieldCheck className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                                  {p.status}
                                </span>
                                <button onClick={() => handleDeleteProduct(p._id)} className="text-[var(--text-muted)] hover:text-red-400 transition-colors" title="Delete Record">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-12 text-[var(--text-muted)]">
                            No assets matching the selected criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[var(--text-soft)]">
                  <thead className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-black)]/20 border-b border-[var(--border-glass)]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Record ID</th>
                      <th className="px-6 py-4 font-medium">Acquirer</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Escrow Value</th>
                      <th className="px-6 py-4 font-medium">Clearance</th>
                      <th className="px-6 py-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">{o._id.substring(0, 8)}</td>
                        <td className="px-6 py-4 text-xs">{o.user?.name || "Guest"}</td>
                        <td className="px-6 py-4 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-mono font-medium text-[var(--accent-gold)]">
                          ${o.totalPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-max border ${o.isPaid ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                              {o.isPaid ? 'Transfer Cleared' : 'Awaiting Wire'}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-max border ${o.isDelivered ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-500/10 text-[var(--text-muted)] border-gray-500/20'}`}>
                              {o.isDelivered ? 'Delivered' : 'In Custody'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {!o.isPaid && (
                              <button onClick={() => handleUpdateOrder(o._id, true, o.isDelivered)} className="text-xs font-semibold text-[var(--accent-gold)] hover:text-[var(--text-main)] transition-colors w-max">
                                Mark Wire Received
                              </button>
                            )}
                            {!o.isDelivered && o.isPaid && (
                              <button onClick={() => handleUpdateOrder(o._id, o.isPaid, true)} className="text-xs font-semibold text-blue-400 hover:text-[var(--text-main)] transition-colors w-max">
                                Mark Dispatched
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-[var(--text-muted)]">
                          No transactions found in the ledger.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* OFFERS TAB */}
            {activeTab === "offers" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[var(--text-soft)]">
                  <thead className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-black)]/20 border-b border-[var(--border-glass)]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Artifact</th>
                      <th className="px-6 py-4 font-medium">Negotiation</th>
                      <th className="px-6 py-4 font-medium">Date Transmitted</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allOffers.map((o) => (
                      <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <Link to={`/product/${o.product?._id}`} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded bg-[var(--bg-black)]/50 border border-[var(--border-glass)] overflow-hidden shrink-0">
                              <img src={o.product?.images[0]?.startsWith('http') ? o.product?.images[0] : `http://localhost:5001${o.product?.images[0]}`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                            </div>
                            <span className="font-medium text-[var(--text-main)] max-w-[150px] truncate group-hover:text-[var(--accent-gold)] transition-colors">{o.product?.title || "Deleted Artifact"}</span>
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-mono font-medium text-[var(--accent-gold)]">₹{o.amount.toLocaleString()}</span>
                            <span className="text-[10px] text-[var(--text-muted)]">From: {o.buyer?.email}</span>
                            <span className="text-[10px] text-[var(--text-muted)]">To: {o.seller?.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-[var(--text-muted)]">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                             <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded w-max border ${
                               o.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                               o.status === 'Accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                               'bg-red-500/10 text-red-400 border-red-500/20'
                             }`}>
                               {o.status}
                             </span>
                             {o.status === 'Pending' && (
                               <div className="flex gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                                 <button onClick={() => handleOfferStatus(o._id, 'Accepted')} className="w-6 h-6 bg-green-500/10 border border-green-500/20 text-green-400 rounded flex items-center justify-center hover:bg-green-500/20 transition-colors" title="Accept Proposal">
                                   <Check className="w-3.5 h-3.5" />
                                 </button>
                                 <button onClick={() => handleOfferStatus(o._id, 'Rejected')} className="w-6 h-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded flex items-center justify-center hover:bg-red-500/20 transition-colors" title="Reject Proposal">
                                   <XCircle className="w-3.5 h-3.5" />
                                 </button>
                               </div>
                             )}
                           </div>
                        </td>
                      </tr>
                    ))}
                    {allOffers.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-[var(--text-muted)]">
                          No private offers circulating the network.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[var(--text-soft)]">
                  <thead className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-black)]/20 border-b border-[var(--border-glass)]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Identity</th>
                      <th className="px-6 py-4 font-medium">Registered Address</th>
                      <th className="px-6 py-4 font-medium">Clearance Level</th>
                      <th className="px-6 py-4 font-medium">Enrollment Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-dark)] flex items-center justify-center shrink-0">
                               <img src={u.avatar?.startsWith('http') ? u.avatar : `http://localhost:5001${u.avatar || '/uploads/default-avatar.png'}`} onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + u.name + "&background=d4af37&color=000" }} alt="" className="w-full h-full object-cover rounded-full bg-[var(--bg-black)]/50"/>
                            </div>
                            <span className="font-medium text-[var(--text-main)]">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{u.email}</td>
                        <td className="px-6 py-4">
                           {u.isAdmin ? (
                             <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 rounded text-[10px] text-[var(--accent-gold)] font-bold uppercase tracking-wider">
                               <ShieldCheck className="w-3 h-3"/> Administrator
                             </span>
                           ) : (
                             <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--glass-light)] border border-[var(--border-glass)] rounded text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">
                               Collector
                             </span>
                           )}
                        </td>
                        <td className="px-6 py-4 text-xs text-[var(--text-muted)]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-[var(--text-muted)]">
                          Network is empty.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* CONCIERGE DESK TAB */}
            {activeTab === "inquiries" && (
              <div className="p-4 sm:p-6 space-y-6">
                {allInquiries.length === 0 ? (
                  <div className="bg-[var(--bg-black)]/20 border border-[var(--border-glass)] rounded-xl py-12 text-center">
                    <MessageSquare className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                    <p className="text-sm text-[var(--text-muted)]">No active VIP requests circulating the network.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {allInquiries.map((inq) => (
                      <div key={inq._id} className="bg-[var(--bg-black)]/30 border border-[var(--border-glass)] hover:border-[var(--accent-gold)]/30 rounded-xl p-5 sm:p-6 transition-colors shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4 border-b border-[var(--border-glass)] pb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                               <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border shrink-0 ${inq.status === 'Resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : inq.status === 'In Process' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                 {inq.status}
                               </span>
                               <span className="text-xs text-[var(--text-muted)] font-mono">ID: {inq._id.substring(0,8)}</span>
                            </div>
                            <h4 className="font-semibold text-[var(--text-main)] text-lg line-clamp-1">{inq.subject}</h4>
                            <p className="text-xs text-[var(--text-soft)]">Originator: <span className="text-[var(--text-main)] font-medium">{inq.user?.name} ({inq.user?.email})</span></p>
                          </div>
                          
                          <div className="shrink-0 flex gap-2 w-full md:w-auto">
                            {inq.status !== 'Resolved' && (
                              <button onClick={() => handleAdminReply(inq._id, inq.status)} className="flex-1 md:flex-none btn btn--gold btn--sm rounded-lg flex items-center justify-center gap-1.5 px-4 shadow-none">
                                <Headset className="w-3.5 h-3.5"/> Transmit Response
                              </button>
                            )}
                          </div>
                        </div>

                        {inq.product && (
                          <div className="flex items-center gap-4 mb-4 bg-white/5 p-3 rounded-lg border border-[var(--border-glass)]">
                             <img src={inq.product.images[0]?.startsWith('http') ? inq.product.images[0] : `http://localhost:5001${inq.product.images[0]}`} className="w-12 h-12 object-cover rounded shadow" alt=""/>
                             <div>
                               <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Inquired Artifact</p>
                               <Link to={`/product/${inq.product._id}`} className="text-sm font-medium text-[var(--text-main)] hover:text-[var(--accent-gold)] transition-colors line-clamp-1">{inq.product.title}</Link>
                             </div>
                          </div>
                        )}

                        <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border-glass)] mb-4 shadow-inner">
                          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-soft)] mb-2 inline-flex items-center gap-1.5"><MessageSquare className="w-3 h-3"/> Message Body</p>
                          <p className="text-sm text-[var(--text-main)] whitespace-pre-wrap">{inq.message}</p>
                        </div>
                        
                        {inq.adminReply && (
                          <div className="bg-[var(--accent-gold)]/10 border-l-4 border-[var(--accent-gold)] p-4 rounded-lg relative overflow-hidden">
                            <CheckCircle className="w-16 h-16 text-[var(--accent-gold)]/5 absolute top-1 right-1 pointer-events-none"/>
                            <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] mb-2 inline-flex items-center gap-1.5"><Headset className="w-3 h-3"/> Official Response Placed</p>
                            <p className="text-sm text-[var(--text-main)] whitespace-pre-wrap">{inq.adminReply}</p>
                          </div>
                        )}
                        
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* JOURNAL CMS TAB */}
            {activeTab === "journal" && (
              <div className="p-4 sm:p-6 space-y-6">
                <div className="flex justify-between items-center bg-[var(--bg-black)]/40 p-4 border border-[var(--border-glass)] rounded-xl">
                   <div>
                     <h3 className="text-xl font-bold text-[var(--text-main)] outfit-font">Editorial Ledger</h3>
                     <p className="text-sm text-[var(--text-muted)]">Manage public content marketing and journalism</p>
                   </div>
                   <button onClick={() => setShowArticleModal(true)} className="btn btn--gold px-4 py-2 text-sm rounded-lg flex items-center gap-2">
                     <BookOpen className="w-4 h-4"/> Compose New
                   </button>
                </div>
                
                {articles.length === 0 ? (
                  <div className="bg-[var(--bg-black)]/20 border border-[var(--border-glass)] rounded-xl py-12 text-center">
                    <BookOpen className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                    <p className="text-sm text-[var(--text-muted)]">No articles published yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {articles.map(art => (
                        <div key={art._id} className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl overflow-hidden flex flex-col">
                           <img src={art.coverImage?.startsWith('http') ? art.coverImage : `http://localhost:5001${art.coverImage}`} className="w-full h-32 object-cover bg-[var(--bg-black)]/50" alt="" />
                           <div className="p-4 flex-1 flex flex-col">
                             <h4 className="font-semibold text-[var(--text-main)] line-clamp-1 mb-1">{art.title}</h4>
                             <p className="text-xs text-[var(--text-muted)] mb-3">By {art.author} • {art.readTime} min read</p>
                             <p className="text-sm text-[var(--text-soft)] line-clamp-2 mb-4 flex-1">{art.excerpt}</p>
                             <Link to={`/journal/${art.slug}`} target="_blank" className="text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] hover:text-white transition-colors">Read Live Mode ↗</Link>
                           </div>
                        </div>
                     ))}
                  </div>
                )}

                {/* Article Modal */}
                {showArticleModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowArticleModal(false)}></div>
                    <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-6 border-b border-[var(--border-glass)] flex justify-between items-center sticky top-0 bg-[var(--bg-card)] z-10">
                        <h3 className="text-xl font-bold text-[var(--text-main)] outfit-font">Compose Editorial</h3>
                        <button onClick={() => setShowArticleModal(false)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                      <form onSubmit={handleCreateArticle} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Title</label>
                            <input type="text" value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-gold)] transition-colors" required placeholder="The Rise of Vintage..." />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">URL Slug</label>
                            <input type="text" value={articleForm.slug} onChange={e => setArticleForm({...articleForm, slug: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-gold)] transition-colors" required />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="col-span-2">
                            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Cover Image URL</label>
                            <input type="text" value={articleForm.coverImage} onChange={e => setArticleForm({...articleForm, coverImage: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-gold)] transition-colors" required placeholder="https://images.unsplash..." />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Read Time (min)</label>
                            <input type="number" value={articleForm.readTime} onChange={e => setArticleForm({...articleForm, readTime: Number(e.target.value)})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-gold)] transition-colors" required min="1" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Excerpt</label>
                          <textarea value={articleForm.excerpt} onChange={e => setArticleForm({...articleForm, excerpt: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none h-20 focus:border-[var(--accent-gold)] transition-colors" required placeholder="Short summary for the index card..."></textarea>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">HTML Content</label>
                          <textarea value={articleForm.content} onChange={e => setArticleForm({...articleForm, content: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none h-40 font-mono focus:border-[var(--accent-gold)] transition-colors" required placeholder="<p>Full article content here...</p>"></textarea>
                        </div>
                        <button type="submit" className="w-full btn btn--gold py-3 rounded-xl font-medium tracking-wide mt-2">Publish Editorial</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            
            {/* COUPONS TAB */}
            {activeTab === "coupons" && (
              <div className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-black)]/40 p-4 border border-[var(--border-glass)] rounded-xl">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-main)] outfit-font">Promo Code System</h3>
                    <p className="text-sm text-[var(--text-muted)]">Create and manage discount codes for collectors</p>
                  </div>
                  <button onClick={() => setShowCouponModal(true)} className="btn btn--gold px-4 py-2 text-sm rounded-lg flex items-center gap-2">
                    <Tag className="w-4 h-4"/> Create Code
                  </button>
                </div>

                {coupons.length === 0 ? (
                  <div className="bg-[var(--bg-black)]/20 border border-[var(--border-glass)] rounded-xl py-12 text-center">
                    <Tag className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                    <p className="text-sm text-[var(--text-muted)]">No promo codes created yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[600px]">
                      <thead className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-glass)]">
                        <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Discount</th><th className="px-4 py-3">Min Order</th><th className="px-4 py-3">Used</th><th className="px-4 py-3">Expires</th><th className="px-4 py-3"></th></tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-glass)]">
                        {coupons.map(c => (
                          <tr key={c._id} className="hover:bg-[var(--glass-light)] transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-[var(--accent-gold)]">{c.code}</td>
                            <td className="px-4 py-3 text-[var(--text-main)]">{c.discountType === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                            <td className="px-4 py-3 text-[var(--text-muted)]">₹{c.minOrder || 0}</td>
                            <td className="px-4 py-3 text-[var(--text-muted)]">{c.usedCount}/{c.maxUses}</td>
                            <td className="px-4 py-3 text-[var(--text-muted)]">{new Date(c.expiresAt).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <button onClick={async () => { await api.delete(`/coupons/${c._id}`); fetchData(); }}
                                className="text-red-400 hover:text-red-300 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {showCouponModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCouponModal(false)}></div>
                    <div className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl shadow-2xl p-6">
                      <h3 className="text-xl font-bold text-[var(--text-main)] outfit-font mb-4">Create Promo Code</h3>
                      <form onSubmit={async (e) => { e.preventDefault(); try { await api.post('/coupons', couponForm); setShowCouponModal(false); setCouponForm({ code: '', discountType: 'percentage', value: 10, minOrder: 0, maxUses: 100, expiresAt: '' }); fetchData(); } catch(err) { alert(err.response?.data?.message || 'Failed'); } }} className="space-y-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Code</label>
                          <input type="text" value={couponForm.code} onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none font-mono uppercase focus:border-[var(--accent-gold)]" required placeholder="GRAIL20" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Type</label>
                            <select value={couponForm.discountType} onChange={e => setCouponForm({...couponForm, discountType: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none">
                              <option value="percentage">Percentage</option>
                              <option value="fixed">Fixed (₹)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Value</label>
                            <input type="number" value={couponForm.value} onChange={e => setCouponForm({...couponForm, value: Number(e.target.value)})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none font-mono" required min="1" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Min Order (₹)</label>
                            <input type="number" value={couponForm.minOrder} onChange={e => setCouponForm({...couponForm, minOrder: Number(e.target.value)})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none font-mono" min="0" />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Max Uses</label>
                            <input type="number" value={couponForm.maxUses} onChange={e => setCouponForm({...couponForm, maxUses: Number(e.target.value)})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none font-mono" required min="1" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1">Expires At</label>
                          <input type="date" value={couponForm.expiresAt} onChange={e => setCouponForm({...couponForm, expiresAt: e.target.value})} className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none" required />
                        </div>
                        <button type="submit" className="w-full btn btn--gold py-3 rounded-xl font-medium">Create Code</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Settings, ShieldCheck, Image as ImageIcon, Briefcase, PlusCircle, CheckCircle, Heart, Handshake, Check, X, Headset, MessageSquare, Clock, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("assets");
  const [myProducts, setMyProducts] = useState([]);
  const [myWatchlist, setMyWatchlist] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [myInquiries, setMyInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [productsRes, watchlistRes, myOffersRes, receivedOffersRes, inquiriesRes] = await Promise.all([
          api.get("/products/my-listings"),
          api.get("/auth/watchlist"),
          api.get("/offers/my-offers"),
          api.get("/offers/received"),
          api.get("/inquiries/my-inquiries")
        ]);
        setMyProducts(productsRes.data.products || []);
        setMyWatchlist(watchlistRes.data || []);
        setMyOffers(myOffersRes.data || []);
        setReceivedOffers(receivedOffersRes.data || []);
        setMyInquiries(inquiriesRes.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'verified': return <span className="badge badge-status-verified flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Verified Active</span>;
      case 'pending': return <span className="badge badge-status-pending flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Authenticating</span>;
      case 'rejected': return <span className="badge badge-status-rejected flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Rejected / Inauthentic</span>;
      default: return null;
    }
  };

  const handleOfferStatus = async (offerId, status) => {
    try {
      await api.put(`/offers/${offerId}/status`, { status });
      // Refresh offers
      const [myRes, recRes] = await Promise.all([
         api.get("/offers/my-offers"),
         api.get("/offers/received")
      ]);
      setMyOffers(myRes.data);
      setReceivedOffers(recRes.data);
    } catch (err) {
      alert("Failed to update offer status");
    }
  };

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-28 pb-20">
      <div className="wrap max-w-5xl">
        
        {/* Profile Header */}
        <div className="glass-card bg-[var(--bg-card)] p-8 md:p-12 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-gold)]/5 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-dark)] p-1 shadow-[0_0_30px_rgba(var(--gold-rgb),0.2)] shrink-0">
              <img 
                src={user?.avatar?.startsWith('http') ? user.avatar : (user?.avatar ? `http://localhost:5001${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=d4af37&color=000`)} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full bg-[var(--bg-black)]/50"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user?.name + "&background=d4af37&color=000" }}
              />
            </div>
            
            <div className="text-center md:text-left flex-1 border-b border-[var(--border-glass)] md:border-b-0 pb-6 md:pb-0">
              <h1 className="text-3xl font-bold text-[var(--text-main)] outfit-font mb-2">{user?.name}</h1>
              <p className="text-[var(--text-muted)] text-sm mb-4">{user?.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--glass-light)] border border-[var(--border-glass)] rounded-full text-xs text-[var(--text-main)] font-medium uppercase tracking-wider">
                  <Briefcase className="w-3.5 h-3.5 text-[var(--accent-gold)]"/> Authorized Collector
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  user?.badge === 'Platinum' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                  user?.badge === 'Gold' ? 'bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border-[var(--accent-gold)]/30' :
                  user?.badge === 'Silver' ? 'bg-gray-400/10 text-gray-300 border-gray-400/30' :
                  'bg-orange-500/10 text-orange-400 border-orange-500/30'
                }`}>
                  <Award className="w-3.5 h-3.5"/> {user?.badge || 'Bronze'} Tier
                </span>
                {user?.isAdmin && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 rounded-full text-xs text-[var(--accent-gold)] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5"/> System Administrator
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
              <Link to="/settings" className="btn btn--glass px-6 rounded-full w-full justify-center">
                <Settings className="w-4 h-4"/> Account Configuration
              </Link>
              <Link to="/my-orders" className="btn btn--glass px-6 rounded-full w-full justify-center">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)]"/> View Acquisitions
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--border-glass)] mb-8">
          <button 
            onClick={() => setActiveTab("assets")}
            className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 ${activeTab === "assets" ? "border-[var(--accent-gold)] text-[var(--text-main)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-soft)]"}`}
          >
            Liquidated Assets
          </button>
          <button 
            onClick={() => setActiveTab("watchlist")}
            className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === "watchlist" ? "border-[var(--accent-gold)] text-[var(--text-main)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-soft)]"}`}
          >
            My Watchlist <Heart className={`w-3.5 h-3.5 ${activeTab === "watchlist" ? "fill-[var(--accent-gold)] text-[var(--accent-gold)]" : ""}`} />
          </button>
          <button 
            onClick={() => setActiveTab("offers")}
            className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === "offers" ? "border-[var(--accent-gold)] text-[var(--text-main)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-soft)]"}`}
          >
            Private Offers <Handshake className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setActiveTab("inquiries")}
            className={`px-6 py-4 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${activeTab === "inquiries" ? "border-[var(--accent-gold)] text-[var(--text-main)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-soft)]"}`}
          >
            Concierge Log <Headset className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Content */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-[var(--border-glass)] pb-4">
            <h2 className="text-2xl font-bold text-[var(--text-main)] outfit-font">
              {activeTab === "assets" ? "Your Listed Operations" : "Watched Artifacts"}
            </h2>
            {activeTab === "assets" && (
              <Link to="/sell" className="btn btn--gold btn--sm rounded-full inline-flex">
                <PlusCircle className="w-4 h-4 mr-1.5" /> Submit New Grail
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-[var(--border-glass)] border-t-[var(--accent-gold)] rounded-full animate-spin"></div>
            </div>
          ) : activeTab === "assets" ? (
            myProducts.length === 0 ? (
              <div className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-12 text-center">
                <ImageIcon className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <h3 className="text-lg text-[var(--text-main)] font-medium mb-2">No Assets Listed</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-6">You have not submitted any items for liquidation to the ForgeVogue network yet.</p>
                <Link to="/sell" className="text-[var(--accent-gold)] hover:underline font-medium text-sm">Begin Liquidation Process</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <div key={product._id} className="glass-card bg-[var(--bg-card)] border-[var(--border-glass)] overflow-hidden flex flex-col group">
                    <div className="relative aspect-video bg-[var(--bg-black)]/50 overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 shadow-[0_2px_10px_rgba(0,0,0,0.5)] rounded-full">
                        {getStatusBadge(product.status)}
                      </div>
                      <img 
                        src={product.images[0]?.startsWith('http') ? product.images[0] : `http://localhost:5001${product.images[0]}`} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-sm font-semibold text-[var(--text-main)] line-clamp-2 leading-snug mb-3">
                        {product.title}
                      </h3>
                      <div className="mt-auto flex justify-between items-center text-sm">
                        <span className="font-mono font-bold text-[var(--accent-gold)]">₹{product.price.toLocaleString()}</span>
                        {product.status === 'verified' && (
                          <Link to={`/product/${product._id}`} className="text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                            View Listing
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : activeTab === "watchlist" ? (
            myWatchlist.length === 0 ? (
              <div className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-12 text-center">
                <Heart className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <h3 className="text-lg text-[var(--text-main)] font-medium mb-2">Watchlist Empty</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-6">You are not currently monitoring any artifacts on the network.</p>
                <Link to="/store" className="text-[var(--accent-gold)] hover:underline font-medium text-sm">Explore Collection</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myWatchlist.map((product) => (
                  <div key={product._id} className="glass-card bg-[var(--bg-card)] border-[var(--border-glass)] overflow-hidden flex flex-col group">
                    <Link to={`/product/${product._id}`} className="relative aspect-square bg-[var(--bg-black)]/50 overflow-hidden block">
                      <img 
                        src={product.images[0]?.startsWith('http') ? product.images[0] : `http://localhost:5001${product.images[0]}`} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-[var(--bg-black)]/20 group-hover:bg-transparent transition-colors duration-500"></div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          /* Since they are on the profile page and the item is watched, clicking removes it */
                          api.post(`/auth/watchlist/${product._id}`).then(() => {
                             setMyWatchlist(prev => prev.filter(p => p._id !== product._id));
                          });
                        }}
                        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-[var(--bg-black)]/60 backdrop-blur flex items-center justify-center border border-[var(--border-glass-strong)] hover:border-red-500 hover:bg-red-500/20 transition-all text-[var(--accent-gold)] hover:text-red-400 group/btn"
                        title="Remove from Watchlist"
                      >
                        <Heart className="w-4 h-4 fill-current group-hover/btn:fill-transparent" />
                      </button>
                    </Link>
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-[var(--text-main)] font-semibold line-clamp-1 mb-3">
                        {product.title}
                      </h3>
                      <div className="mt-auto">
                        <span className="font-mono font-bold text-[var(--text-main)]">₹{product.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : activeTab === "offers" ? (
            <div className="space-y-12">
              
              {/* Offers Received */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] outfit-font mb-4 flex items-center gap-2"><Handshake className="w-5 h-5 text-[var(--accent-gold)]" /> Incoming Proposals</h3>
                {receivedOffers.length === 0 ? (
                  <div className="bg-[var(--bg-card)]/20 border border-[var(--border-glass)] rounded-xl p-6 text-center text-sm text-[var(--text-muted)]">
                    No binding offers received on your assets.
                  </div>
                ) : (
                  <div className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl overflow-hidden divide-y divide-[var(--border-glass)]">
                    {receivedOffers.map(offer => (
                      <div key={offer._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <Link to={`/product/${offer.product._id}`} className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-[var(--border-glass)] hidden sm:block">
                            <img src={offer.product.images[0]?.startsWith('http') ? offer.product.images[0] : `http://localhost:5001${offer.product.images[0]}`} alt="" className="w-full h-full object-cover" />
                          </Link>
                          <div>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest leading-none mb-1">On: {offer.product.title}</p>
                            <p className="font-mono text-lg font-bold text-[var(--accent-gold)] leading-none mb-2">₹{offer.amount.toLocaleString()}</p>
                            <p className="text-xs text-[var(--text-soft)] font-medium">From: {offer.buyer.email}</p>
                            {offer.message && <div className="mt-2 text-xs italic text-[var(--text-muted)] bg-white/5 p-2 rounded border-l-2 border-[var(--accent-gold)]">"{offer.message}"</div>}
                          </div>
                        </div>
                        <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                          {offer.status === "Pending" ? (
                            <>
                              <button onClick={() => handleOfferStatus(offer._id, "Accepted")} className="flex-1 sm:w-32 py-2 px-4 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-semibold uppercase flex items-center justify-center gap-1.5 transition-colors"><Check className="w-3 h-3"/> Accept</button>
                              <button onClick={() => handleOfferStatus(offer._id, "Rejected")} className="flex-1 sm:w-32 py-2 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold uppercase flex items-center justify-center gap-1.5 transition-colors"><X className="w-3 h-3"/> Reject</button>
                            </>
                          ) : (
                            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border flex items-center justify-center w-full sm:w-32 ${offer.status === 'Accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                              {offer.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Offers Sent */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] outfit-font mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-[var(--accent-gold)]" /> Your Sent Proposals</h3>
                {myOffers.length === 0 ? (
                  <div className="bg-[var(--bg-card)]/20 border border-[var(--border-glass)] rounded-xl p-6 text-center text-sm text-[var(--text-muted)]">
                    You have not submitted any private offers.
                  </div>
                ) : (
                  <div className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl overflow-hidden divide-y divide-[var(--border-glass)]">
                    {myOffers.map(offer => (
                      <div key={offer._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Link to={`/product/${offer.product._id}`} className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-[var(--border-glass)] hidden sm:block">
                            <img src={offer.product.images[0]?.startsWith('http') ? offer.product.images[0] : `http://localhost:5001${offer.product.images[0]}`} alt="" className="w-full h-full object-cover" />
                          </Link>
                          <div>
                            <Link to={`/product/${offer.product._id}`} className="text-sm font-semibold text-[var(--text-main)] hover:text-[var(--accent-gold)] transition-colors line-clamp-1 mb-1">{offer.product.title}</Link>
                            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                              <span>Value: ${offer.product.price.toLocaleString()}</span>
                              <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></span>
                              <span className="font-mono font-medium text-[var(--accent-gold)]">You offered: ${offer.amount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border shrink-0 ${
                          offer.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                          offer.status === 'Accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {offer.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ) : activeTab === "inquiries" ? (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[var(--text-main)] outfit-font mb-4 flex items-center gap-2"><Headset className="w-5 h-5 text-[var(--accent-gold)]" /> Concierge Dispatches</h3>
              {myInquiries.length === 0 ? (
                <div className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                  <h3 className="text-lg text-[var(--text-main)] font-medium mb-2">No Open Inquiries</h3>
                  <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">You have not dispatched any verification or sourcing requests to our VIP network.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {myInquiries.map((inq) => (
                    <div key={inq._id} className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl p-5 sm:p-6 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 border-b border-[var(--border-glass)] pb-4">
                        <div>
                          <h4 className="font-semibold text-[var(--text-main)] text-lg mb-1">{inq.subject}</h4>
                          <span className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                             <Clock className="w-3 h-3"/> {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border shrink-0 ${inq.status === 'Resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : inq.status === 'In Process' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                           {inq.status}
                        </span>
                      </div>
                      
                      {inq.product && (
                        <Link to={`/product/${inq.product._id}`} className="inline-flex items-center gap-3 mb-4 p-3 bg-[var(--bg-main)] rounded-lg border border-[var(--border-glass)] hover:border-[var(--accent-gold)] transition-colors group">
                           {inq.product.images?.length > 0 && <img src={inq.product.images[0]?.startsWith('http') ? inq.product.images[0] : `http://localhost:5001${inq.product.images[0]}`} alt="" className="w-10 h-10 rounded border border-[var(--border-glass)] object-cover"/>}
                           <span className="text-sm font-medium text-[var(--text-soft)] group-hover:text-[var(--text-main)] transition-colors line-clamp-1">{inq.product.title}</span>
                        </Link>
                      )}

                      <div className="space-y-4">
                        <div className="bg-[var(--bg-main)] p-4 rounded-lg border border-[var(--border-glass)] shadow-inner">
                          <p className="text-sm text-[var(--text-soft)] whitespace-pre-wrap">{inq.message}</p>
                        </div>
                        {inq.adminReply && (
                          <div className="bg-[var(--accent-gold)]/5 border-l-4 border-[var(--accent-gold)] p-4 rounded-lg shadow-sm ml-4 sm:ml-8 relative">
                            <Headset className="w-4 h-4 text-[var(--accent-gold)] absolute top-4 right-4 opacity-50"/>
                            <p className="text-xs uppercase tracking-wider text-[var(--accent-gold)] font-bold mb-2">Concierge Response</p>
                            <p className="text-sm text-[var(--text-main)] whitespace-pre-wrap">{inq.adminReply}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
        
      </div>
    </div>
  );
};

export default Profile;

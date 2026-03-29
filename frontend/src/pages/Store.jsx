import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, SlidersHorizontal, Search, ShieldCheck, Diamond, X, ShoppingBag, Heart } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Tilt from "react-parallax-tilt";
import ProductSkeleton from "../components/ProductSkeleton";
import PageTransition from "../components/PageTransition";

const categories = [
  "Rare Sneakers",
  "Classic Watches",
  "Vintage Books",
  "Limited Edition Art",
  "Signed Memorabilia",
  "Antique Collectibles",
  "Vinyl Records",
];

const rarities = ["Rare", "Ultra Rare", "Legendary"];

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filters
  const [category, setCategory] = useState(initialCategory);
  const [rarity, setRarity] = useState("");
  const [search, setSearch] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart } = useCart();
  const { user, watchlist, toggleWatchlist } = useAuth();

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [category, rarity, searchParams.get("search")]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [category, rarity, searchParams.get("search"), page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const currentSearch = searchParams.get("search") || "";
      
      let query = `/products?page=${page}&limit=12&`;
      if (category) query += `category=${category}&`;
      if (rarity) query += `rarity=${rarity}&`;
      if (currentSearch) query += `search=${currentSearch}&`;

      const res = await api.get(query);
      setProducts(res.data.products);
      setTotalPages(res.data.pages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(search ? { search } : {});
  };

  const clearFilters = () => {
    setCategory("");
    setRarity("");
    setSearch("");
    setSearchParams({});
  };

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "tween", ease: "easeOut", duration: 0.5 } }
  };

  return (
    <PageTransition className="bg-[var(--bg-main)] min-h-screen pt-28 pb-20">
      <div className="wrap">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-main)] mb-4 outfit-font">The Collection</h1>
            <p className="text-[var(--text-muted)] max-w-xl">
              Browse our curated selection of authenticated rare artifacts, timepieces, and cultural grails.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search collection..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--glass-light)] border border-[var(--border-glass)] rounded-full py-2.5 pl-10 pr-4 text-sm text-[var(--text-main)] placeholder-gray-500 focus:outline-none focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] transition-all"
              />
            </form>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 bg-[var(--glass-light)] border border-[var(--border-glass)] rounded-full py-2.5 px-6 text-sm text-[var(--text-main)] hover:bg-[var(--glass-light)] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          
          {/* SIDEBAR FILTERS (Desktop) */}
          <aside className={`w-full md:w-64 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-32 space-y-8">
              
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-glass)]">
                <div className="flex items-center gap-2 font-medium text-[var(--text-main)] outfit-font">
                  <Filter className="w-4 h-4 text-[var(--accent-gold)]" /> Refine By
                </div>
                {(category || rarity || search) && (
                  <button onClick={clearFilters} className="text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors">
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">Category</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setCategory("")}
                    className={`block w-full text-left text-sm py-1.5 transition-colors ${
                      category === "" ? "text-[var(--accent-gold)] font-medium" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`block w-full text-left text-sm py-1.5 transition-colors ${
                        category === c ? "text-[var(--accent-gold)] font-medium" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity Filter */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">Rarity Level</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setRarity("")}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      rarity === "" 
                        ? "bg-[var(--accent-gold)] border-[var(--accent-gold)] text-[var(--text-black)]" 
                        : "bg-transparent border-[var(--border-glass)] text-[var(--text-muted)] hover:border-white/30 hover:text-[var(--text-main)]"
                    }`}
                  >
                    Any
                  </button>
                  {rarities.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRarity(r)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        rarity === r
                          ? "bg-[var(--accent-gold)] border-[var(--accent-gold)] text-[var(--text-black)]" 
                          : "bg-transparent border-[var(--border-glass)] text-[var(--text-muted)] hover:border-white/30 hover:text-[var(--text-main)]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Authenticity Guarantee */}
              <div className="bg-[var(--glass-light)] border border-[var(--accent-gold)]/20 rounded-xl p-5 mt-8">
                <ShieldCheck className="w-8 h-8 text-[var(--accent-gold)] mb-3" />
                <h4 className="text-[var(--text-main)] font-medium text-sm mb-2">Verified Authentic</h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Every item in this collection has been physically inspected and verified by independent specialists.
                </p>
              </div>

            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main className="flex-1 min-w-0">
            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                 {[...Array(6)].map((_, i) => (
                    <ProductSkeleton key={i} />
                 ))}
               </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center border border-[var(--border-glass)] rounded-2xl bg-white/[0.02]">
                <Diamond className="w-12 h-12 text-[var(--text-muted)] mb-4" />
                <h3 className="text-xl text-[var(--text-main)] font-medium mb-2">No grails found</h3>
                <p className="text-[var(--text-muted)] text-sm">
                  We couldn't find any items matching those exact criteria.
                </p>
                <button onClick={clearFilters} className="mt-6 text-[var(--accent-gold)] hover:underline text-sm font-medium">
                  Clear Filters
                </button>
              </div>
            ) : (
              <motion.div 
                variants={containerVars}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((p) => (
                  <motion.div key={p._id} variants={itemVars} className="group relative">
                    <Tilt 
                      tiltMaxAngleX={5} 
                      tiltMaxAngleY={5} 
                      perspective={1000}
                      scale={1.02}
                      transitionSpeed={1500}
                      className="h-full flex flex-col"
                    >
                      <div className="glass-card flex flex-col h-full bg-[var(--bg-card)] overflow-hidden">
                      
                      {/* Image Area */}
                      <Link to={`/product/${p._id}`} className="relative aspect-square overflow-hidden bg-[var(--bg-black)]/60 block">
                        <div className="absolute top-4 left-4 z-10">
                          <span className={`badge ${
                            p.rarity === 'Legendary' ? 'badge-legendary' 
                            : p.rarity === 'Ultra Rare' ? 'badge-ultra' 
                            : 'badge-rarity'
                          }`}>
                            {p.rarity}
                          </span>
                        </div>
                        <img 
                          src={p.images?.[0]?.startsWith('http') ? p.images[0] : (p.images?.[0] ? `http://localhost:5001${p.images[0]}` : '/default-placeholder.png')}
                          alt={p.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[var(--bg-black)]/20 group-hover:bg-transparent transition-colors duration-500"></div>
                      </Link>

                      {user && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            toggleWatchlist(p._id);
                          }}
                          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[var(--bg-black)]/50 backdrop-blur-md flex items-center justify-center border border-[var(--border-glass)] hover:bg-[var(--glass-light)] transition-all"
                          title="Toggle Watchlist"
                        >
                          <Heart className={`w-4 h-4 ${watchlist?.includes(p._id) ? "fill-[var(--accent-gold)] text-[var(--accent-gold)]" : "text-white"}`} />
                        </button>
                      )}

                      {/* Content Area */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">{p.category}</span>
                          {p.authenticityCertificate && <ShieldCheck className="w-4 h-4 text-[var(--accent-success)]" title="Verified" />}
                        </div>
                        
                        <Link to={`/product/${p._id}`}>
                          <h3 className="text-[var(--text-main)] font-semibold leading-snug mb-2 group-hover:text-[var(--accent-gold)] transition-colors line-clamp-2">
                            {p.title}
                          </h3>
                        </Link>
                        
                        <div className="mt-auto pt-4 flex items-end justify-between">
                          <div>
                            <p className="text-xs text-[var(--text-muted)] mb-0.5">Valuation</p>
                            <p className="text-lg font-bold font-mono text-[var(--text-main)]">${(p.price || 0).toLocaleString()}</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart(p);
                            }}
                            className="bg-[var(--glass-light)] hover:bg-[var(--accent-gold)] hover:text-[var(--text-black)] border border-[var(--border-glass)] hover:border-transparent rounded-full p-2.5 transition-all outline-none"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                    </Tilt>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <div className="inline-flex glass rounded-full p-1 border border-[var(--border-glass)]">
                  <button 
                    onClick={() => {
                      setPage(p => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-50"
                  >
                    ←
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i + 1}
                      onClick={() => {
                        setPage(i + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                        page === i + 1 
                          ? "bg-[var(--accent-gold)] text-[var(--text-black)]" 
                          : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => {
                      setPage(p => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={page === totalPages}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </main>

        </div>
      </div>
    </PageTransition>
  );
};

export default Store;
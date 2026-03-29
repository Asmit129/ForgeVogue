import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Diamond, ArrowRight, Star } from "lucide-react";
import Tilt from "react-parallax-tilt";
import api from "../api/axios";
import { heroSlides, homeAlbum, statsData } from "../data/content";
import { useCart } from "../context/CartContext";
import ProductSkeleton from "../components/ProductSkeleton";
import PageTransition from "../components/PageTransition";
import MagneticWrapper from "../components/MagneticWrapper";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    // Auto-advance hero slides
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        // Fetch top tier items
        const res = await api.get("/products?rarity=Legendary,Ultra Rare&limit=4");
        setFeaturedProducts(res.data.products || []);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <PageTransition className="bg-[var(--bg-main)] min-h-screen">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Video Slider */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-0" : "opacity-0 z-[-1]"
            }`}
          >
            <img
              src={slide.image}
              alt="ForgeVogue"
              className="object-cover w-full h-full scale-105"
            />
            {/* Dark glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/60 backdrop-blur-[2px]"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center pt-20">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block py-1 px-3 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-[var(--accent-gold)] text-sm font-semibold tracking-widest uppercase mb-6 shadow-xl">
              {heroSlides[currentSlide].subtitle}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-6 outfit-font leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-2xl mx-auto mb-10 font-light">
              {heroSlides[currentSlide].desc}
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative mb-8 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-gold)] transition-colors" />
              </div>
              <input
                type="text"
                className="w-full bg-[var(--glass-medium)] backdrop-blur-md border border-white/20 rounded-full py-4 pl-12 pr-32 text-white placeholder-gray-300 focus:outline-none focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)] transition-all"
                placeholder="Search Rolex, Jordan 1, Banksy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-[var(--accent-gold)] hover:bg-[var(--accent-gold-hover)] text-[var(--text-black)] font-semibold rounded-full px-6 transition-colors"
              >
                Search
              </button>
            </form>

            <div className="flex justify-center gap-4">
              <MagneticWrapper>
                <Link to={heroSlides[currentSlide].ctaHref} className="btn btn--gold btn--lg rounded-full">
                  {heroSlides[currentSlide].ctaText}
                </Link>
              </MagneticWrapper>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-[var(--accent-gold)]" : "w-4 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. STATS BANNER */}
      <section className="border-y border-[var(--border-glass)] bg-[var(--bg-black)]/40 backdrop-blur-md">
        <div className="wrap py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {statsData.map((stat, i) => (
              <div key={i} className="px-4">
                <p className="text-3xl font-bold text-[var(--text-main)] mb-1 outfit-font">{stat.value}</p>
                <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE VAULT (Categories) */}
      <section className="section wrap">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--accent-gold)]"></div>
            <Diamond className="text-[var(--accent-gold)] w-5 h-5" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--accent-gold)]"></div>
          </div>
          <h2 className="headline text-[var(--text-main)]">The Vault</h2>
          <p className="lead mt-4 max-w-2xl mx-auto">Explore curated categories containing the world's most desired and elusive items, fully authenticated and secured.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {homeAlbum.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link to={cat.link} className="group relative block h-[400px] rounded-2xl overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity group-hover:opacity-90"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-2 outfit-font drop-shadow-md">{cat.title}</h3>
                  <p className="text-[var(--text-soft)] drop-shadow-sm text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="mt-4 inline-flex items-center text-[var(--accent-gold)] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    Explore <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED GRAILS */}
      <section className="section bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-card)] relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--accent-gold)]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

        <div className="wrap relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="headline text-[var(--text-main)] mb-4">Featured Grails</h2>
              <p className="lead max-w-xl">Pieces of history, pop culture phenomenon, and horological masterpieces recently inducted into our marketplace.</p>
            </motion.div>
            <Link to="/store" className="btn btn--glass text-[var(--accent-gold)] whitespace-nowrap hidden md:inline-flex">
              View All Grails <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                   <ProductSkeleton key={i} />
                ))}
             </div>
          ) : featuredProducts.length === 0 ? (
            <div className="glass-card p-12 text-center text-[var(--text-muted)]">
              <Diamond className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">The vault is currently securing new legendary items.</p>
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredProducts.map((p) => (
                <motion.div key={p._id} variants={fadeUp} className="group h-full flex flex-col">
                  <Tilt 
                    tiltMaxAngleX={8} 
                    tiltMaxAngleY={8} 
                    perspective={1000}
                    scale={1.02}
                    transitionSpeed={2000} 
                    gyroscope={true}
                    className="flex-1 flex flex-col h-full"
                  >
                    <div className="glass-card flex-1 p-4 flex flex-col items-start relative overflow-hidden h-full">
                    {/* Glowing background effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-gold)]/0 to-[var(--accent-gold)]/0 group-hover:from-[var(--accent-gold)]/5 group-hover:to-transparent transition-colors duration-500"></div>
                    
                    {/* Rarity Badge */}
                    <div className="absolute top-6 left-6 z-10">
                      <span className={`badge ${
                        p.rarity === 'Legendary' ? 'badge-legendary' 
                        : p.rarity === 'Ultra Rare' ? 'badge-ultra' 
                        : 'badge-rarity'
                      }`}>
                        {p.rarity}
                      </span>
                    </div>

                    {/* Image */}
                    <Link to={`/product/${p._id}`} className="w-full relative aspect-square mb-6 overflow-hidden rounded-xl bg-[var(--bg-black)]/50">
                      <img 
                        src={p.images[0]?.startsWith('http') ? p.images[0] : `http://localhost:5001${p.images[0]}`}
                        alt={p.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex-1 flex flex-col w-full relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{p.category}</span>
                        {p.authenticityCertificate && (
                          <ShieldCheck className="w-4 h-4 text-[var(--accent-success)]" title="Verified Authentic" />
                        )}
                      </div>
                      
                      <Link to={`/product/${p._id}`}>
                        <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2 hover:text-[var(--accent-gold)] transition-colors line-clamp-2 leading-snug">
                          {p.title}
                        </h3>
                      </Link>
                      
                      <div className="mt-auto pt-4 border-t border-[var(--border-glass)] flex items-center justify-between">
                        <div>
                          <p className="text-sm text-[var(--text-muted)] mb-1">Current Value</p>
                          <p className="text-xl font-bold text-[var(--text-main)] font-mono">
                            ${p.price.toLocaleString()}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(p);
                          }}
                          className="w-10 h-10 rounded-full bg-[var(--glass-light)] border border-[var(--border-glass)] flex items-center justify-center hover:bg-[var(--accent-gold)] hover:text-[var(--text-black)] hover:border-transparent transition-all"
                          title="Add to Vault"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  </Tilt>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-10 text-center md:hidden">
            <Link to="/store" className="btn btn--glass text-[var(--accent-gold)] w-full">
              View All Grails
            </Link>
          </div>
        </div>
      </section>

      {/* 5. AUTHENTICATION / TRUST SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/seed/img_ee5c8aa262.jpg" 
            alt="Authentication Process" 
            className="w-full h-full object-cover opacity-20 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/80 to-transparent"></div>
        </div>
        
        <div className="wrap relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--glass-light)] border border-[var(--border-glass)] text-xs text-[var(--text-soft)] font-medium tracking-widest uppercase mb-6">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)]" />
              The ForgeVogue Standard
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-main)] mb-6 outfit-font leading-tight">
              Trust is our most <br/><span className="text-gradient-gold">Valuable Asset.</span>
            </h2>
            
            <p className="text-lg text-[var(--text-soft)] mb-12">
              Every collectible submitted to ForgeVogue undergoes a rigorous, multi-step authentication process by world-renowned specialists before it ever reaches the marketplace.
            </p>
            
            <div className="space-y-8">
              {[
                { title: "Expert Verification", desc: "Specialists examine materials, stitching, serial numbers, and historical provenance." },
                { title: "Condition Grading", desc: "Items are professionally graded from 'Fair' to 'Mint' based on strict market standards." },
                { title: "Secure Custody", desc: "Verified items are held securely in our insured vault facilities until purchased." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)] font-bold">
                    0{i + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-[var(--text-main)] mb-2">{step.title}</h4>
                    <p className="text-[var(--text-muted)]">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <MagneticWrapper>
                <Link to="/about" className="btn btn--gold">
                  Read About Our Process
                </Link>
              </MagneticWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION (SELL) */}
      <section className="py-20 bg-[var(--accent-gold)]">
        <div className="wrap text-center text-[var(--text-black)]">
          <Star className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 outfit-font">Liquidate Your Grails</h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
            Join thousands of elite collectors selling authenticated sneakers, watches, and art through ForgeVogue securely and privately.
          </p>
          <MagneticWrapper>
            <Link to="/sell" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--bg-black)] text-white rounded-full font-bold text-lg hover:bg-[var(--bg-black-hover)] hover:scale-105 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
              Start Selling Today <ArrowRight className="w-5 h-5" />
            </Link>
          </MagneticWrapper>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;

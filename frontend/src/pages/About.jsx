import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Globe, Search, Award, Fingerprint, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-[var(--bg-main)] min-h-screen text-[var(--text-main)] pt-20">
      
      {/* 1. Hero / Manifesto */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-[var(--border-glass)]">
        <div className="absolute inset-0 bg-[url('/seed/img_0896ffafdd.jpg')] bg-cover bg-center bg-no-repeat opacity-[0.15] mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/80 to-transparent"></div>
        <div className="wrap relative z-10 max-w-4xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-block py-1 px-3 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] text-xs font-bold tracking-widest uppercase mb-6">
              Our Manifesto
            </span>
            <h1 className="text-4xl md:text-6xl font-bold outfit-font leading-tight mb-8">
              Redefining the standard for <span className="text-gradient-gold">elusive culture.</span>
            </h1>
            <p className="text-lg md:text-xl text-[var(--text-soft)] leading-relaxed font-light">
              ForgeVogue was established in 2026 to solve the luxury market's greatest weakness: trust. We act as the impenetrable barrier between discerning collectors and counterfeit markets, ensuring that every grail acquired is undeniably authentic.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. The Verification Matrix */}
      <section className="py-24 md:py-32 wrap">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold outfit-font mb-4">The Matrix of Authentication</h2>
          <p className="text-[var(--text-muted)]">Our physical vetting protocol is the most rigorous in the industry. We do not rely on images; we rely on molecular-level inspection and historical deep-dives.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Search, title: "Material Analysis", desc: "Inspection of weight, stitching density, materials, and typography down to the micron. For horology, movement disassembly and serial matching." },
            { icon: Fingerprint, title: "Provenance Tracking", desc: "We utilize proprietary databases and network specialists to trace the lifeline of the asset backward to the point of origin." },
            { icon: Lock, title: "Secure Custody", desc: "Upon verification, assets are transported to our climate-controlled, Class-A vaulting facilities pending acquisition." },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              transition={{ delay: i * 0.2 }}
              className="glass-card p-8 bg-[var(--bg-card)]/60 border border-[var(--border-glass)] hover:border-[var(--accent-gold)]/30 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <feature.icon className="w-32 h-32 text-[var(--text-main)]" />
              </div>
              <div className="w-14 h-14 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 flex items-center justify-center mb-6 relative z-10">
                <feature.icon className="w-6 h-6 text-[var(--accent-gold)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-3 outfit-font relative z-10">{feature.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed relative z-10">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Global Network & Stats */}
      <section className="py-24 bg-[var(--bg-card)] border-y border-[var(--border-glass)] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none"></div>
        <div className="wrap relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold outfit-font mb-6">A borderless nexus for serious acquisitions.</h2>
            <p className="text-[var(--text-muted)] mb-8 leading-relaxed max-w-xl">
              From Tokyo to Geneva, our procurement network spans the globe. We facilitate discreet, high-value transfers between private estates, specialized dealers, and individual enthusiasts.
            </p>
            <Link to="/store" className="inline-flex items-center text-[var(--accent-gold)] font-semibold hover:text-[var(--text-main)] transition-colors group text-lg">
              Enter The Collection <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="flex-1 grid grid-cols-2 gap-6 w-full">
            <div className="glass-card p-6 bg-[var(--bg-card)]/80 text-center">
              <Globe className="w-8 h-8 text-[var(--accent-gold)] mx-auto mb-3" />
              <p className="text-3xl font-bold font-mono text-[var(--text-main)] mb-1">54</p>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">Countries Reached</p>
            </div>
            <div className="glass-card p-6 bg-[var(--bg-card)]/80 text-center translate-y-6">
              <Award className="w-8 h-8 text-[var(--accent-gold)] mx-auto mb-3" />
              <p className="text-3xl font-bold font-mono text-[var(--text-main)] mb-1">99.9%</p>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">Authentication Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="py-32 text-center wrap">
        <ShieldCheck className="w-16 h-16 text-[var(--accent-gold)] mx-auto mb-8" />
        <h2 className="text-4xl font-bold outfit-font mb-6">Ready to expand your portfolio?</h2>
        <p className="text-[var(--text-muted)] mb-10 max-w-2xl mx-auto">
          Create an identity within our network to buy, sell, and track the value of the most coveted items on earth.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="btn btn--gold px-8 py-4 rounded-full font-bold">
            Apply for Access
          </Link>
          <Link to="/sell" className="btn btn--glass px-8 py-4 rounded-full font-bold">
            Liquidate Assets
          </Link>
        </div>
      </section>

    </div>
  );
};

export default About;
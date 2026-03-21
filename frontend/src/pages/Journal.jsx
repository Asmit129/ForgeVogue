import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ArrowRight, BookMarked, TrendingUp } from "lucide-react";
import api from "../api/axios";

const Journal = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get("/articles");
        setArticles(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-28 pb-20">
      <div className="wrap relative">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-[var(--accent-gold)]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <BookMarked className="w-12 h-12 text-[var(--accent-gold)] mx-auto mb-6 opacity-80" />
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-main)] outfit-font mb-4 tracking-tight">The Journal</h1>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Discourses on provenance, exclusive interviews with private collectors, and historical insights into global artifacts, curated by the ForgeVogue Editorial Board.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-12 h-12 border-4 border-[var(--border-glass)] border-t-[var(--accent-gold)] rounded-full animate-spin"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="glass-card bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl p-16 text-center max-w-2xl mx-auto">
             <BookOpen className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
             <h3 className="text-2xl font-bold text-[var(--text-main)] outfit-font mb-2">Publications Imminent</h3>
             <p className="text-[var(--text-muted)]">Our curators are currently drafting the inaugural volume of The Journal. Return shortly for exclusive editorials.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 masonry-grid">
            {articles.map((article, idx) => (
              <Link 
                key={article._id} 
                to={`/journal/${article.slug}`} 
                className={`glass-card bg-[var(--bg-card)] border-[var(--border-glass)] overflow-hidden group flex flex-col h-full transform transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${idx === 0 ? 'md:col-span-2 lg:col-span-2 flex-col md:flex-row' : ''}`}
              >
                <div className={`relative bg-[var(--bg-black)] overflow-hidden shrink-0 ${idx === 0 ? 'md:w-1/2 aspect-video md:aspect-auto h-64 md:h-auto' : 'aspect-video'}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent z-10 opacity-60"></div>
                  <img src={article.coverImage.startsWith('http') ? article.coverImage : `http://localhost:5001${article.coverImage}`} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  {idx === 0 && <span className="absolute top-6 left-6 z-20 bg-[var(--accent-gold)] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm flex items-center gap-1.5"><TrendingUp className="w-3 h-3"/> Featured Editorial</span>}
                </div>
                <div className={`p-8 md:p-10 flex flex-col flex-1 ${idx === 0 ? 'justify-center md:w-1/2' : ''}`}>
                  <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mb-4">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--text-soft)]"></span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {article.readTime} Min Read</span>
                  </div>
                  <h2 className={`font-bold text-[var(--text-main)] outfit-font mb-4 group-hover:text-[var(--accent-gold)] transition-colors ${idx === 0 ? 'text-3xl lg:text-4xl leading-tight' : 'text-xl'}`}>
                    {article.title}
                  </h2>
                  <p className="text-[var(--text-soft)] text-sm mb-6 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-main)]">{article.author}</span>
                    <span className="w-10 h-10 rounded-full border border-[var(--border-glass)] flex items-center justify-center text-[var(--accent-gold)] group-hover:bg-[var(--accent-gold)] group-hover:text-black transition-colors">
                      <ArrowRight className="w-4 h-4"/>
                    </span>
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

export default Journal;

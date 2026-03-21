import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import api from "../api/axios";

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${slug}`);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex justify-center items-center">
         <div className="w-12 h-12 border-4 border-[var(--border-glass)] border-t-[var(--accent-gold)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col justify-center items-center text-center px-4">
         <h2 className="text-3xl font-bold text-[var(--text-main)] outfit-font mb-4">Editorial Not Found</h2>
         <p className="text-[var(--text-muted)] mb-8">This publication may have been archived or removed from the secure network.</p>
         <Link to="/journal" className="btn btn--gold rounded-full px-8">Return to Journal</Link>
      </div>
    );
  }

  return (
    <article className="bg-[var(--bg-main)] min-h-screen pt-24 pb-20 selection:bg-[var(--accent-gold)] selection:text-black">
      {/* Hero Banner */}
      <div className="w-full h-[50vh] min-h-[400px] max-h-[600px] relative overflow-hidden bg-[var(--bg-black)]">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-transparent to-[var(--bg-main)]/50 z-10"></div>
        <img src={article.coverImage.startsWith('http') ? article.coverImage : `http://localhost:5001${article.coverImage}`} alt={article.title} className="w-full h-full object-cover scale-105" />
        
        <div className="absolute bottom-0 left-0 w-full z-20 pb-16 px-6">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-6">
              <span className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2"><Calendar className="w-3.5 h-3.5"/> {new Date(article.createdAt).toLocaleDateString()}</span>
              <span className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2"><Clock className="w-3.5 h-3.5"/> {article.readTime} Min Read</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white outfit-font leading-tight drop-shadow-xl mb-6">
              {article.title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl font-light">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-between border-b mx-auto max-w-2xl border-[var(--border-glass)] pb-8 mb-12">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--glass-medium)] border border-[var(--border-glass)] flex items-center justify-center">
                 <User className="w-6 h-6 text-[var(--accent-gold)]"/>
              </div>
              <div className="text-left">
                 <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">Author / Curator</p>
                 <p className="font-bold text-[var(--text-main)]">{article.author}</p>
              </div>
           </div>
           <button className="w-10 h-10 rounded-full border border-[var(--border-glass)] hover:border-[var(--accent-gold)] flex items-center justify-center text-[var(--text-main)] hover:text-[var(--accent-gold)] transition-colors group">
              <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform"/>
           </button>
        </div>

        {/* Article Body */}
        <div className="prose prose-invert prose-lg max-w-2xl mx-auto prose-p:text-[var(--text-soft)] prose-p:leading-relaxed prose-headings:text-[var(--text-main)] prose-headings:outfit-font prose-a:text-[var(--accent-gold)] prose-strong:text-[var(--text-main)]">
           {/* In a real app we might use react-markdown, but we'll simulate text rendering easily here */}
           {article.content.split('\n\n').map((paragraph, idx) => (
             <p key={idx} className="mb-6">{paragraph}</p>
           ))}
        </div>

        <div className="max-w-2xl mx-auto mt-20 pt-10 border-t border-[var(--border-glass)] text-center">
           <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors">
              <ArrowLeft className="w-4 h-4"/> Return to Editorial Index
           </Link>
        </div>
      </div>
    </article>
  );
};

export default ArticleDetail;

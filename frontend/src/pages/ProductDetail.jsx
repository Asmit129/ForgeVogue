import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft, Shield, Award, Clock, Share2, Star, ExternalLink, MessageSquare, Send } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import ImageMagnifier from "../components/ImageMagnifier";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products/single/${id}`);
        setProduct(res.data);
        setSelectedImage(0);
        // Check wishlist
        if (user) {
          try {
            const wlRes = await api.get("/auth/watchlist");
            setIsWishlisted(wlRes.data.some((p) => p._id === id));
          } catch { }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, user]);

  useEffect(() => {
    if (!id) return;
    // Fetch related
    api.get(`/products/single/${id}/related`).then(r => setRelatedProducts(r.data || [])).catch(() => {});
    // Fetch reviews
    api.get(`/reviews/${id}`).then(r => {
      setReviews(r.data.reviews || []);
      setAvgRating(r.data.averageRating || 0);
      setNumReviews(r.data.numReviews || 0);
    }).catch(() => {});
  }, [id]);

  const handleWishlist = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post(`/auth/watchlist/${id}`);
      setIsWishlisted(!isWishlisted);
    } catch (err) { console.error(err); }
  };

  const handleOffer = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post("/offers", { product: id, amount: Number(offerAmount), message: offerMessage });
      alert("Private offer submitted!");
      setShowOfferModal(false);
      setOfferAmount(""); setOfferMessage("");
    } catch (err) { alert(err.response?.data?.message || "Failed to submit offer"); }
  };

  const handleInquiry = async () => {
    if (!user) return navigate("/login");
    try {
      await api.post("/inquiries", { product: id, subject: inquirySubject, message: inquiryMessage });
      alert("Concierge request dispatched!");
      setShowInquiryModal(false);
      setInquirySubject(""); setInquiryMessage("");
    } catch (err) { alert(err.response?.data?.message || "Failed"); }
  };

  const handleReviewSubmit = async () => {
    try {
      const res = await api.post("/reviews", { product: id, rating: reviewRating, comment: reviewComment });
      setReviews(prev => [res.data, ...prev]);
      setNumReviews(prev => prev + 1);
      setAvgRating(prev => ((prev * (numReviews) + reviewRating) / (numReviews + 1)).toFixed(1));
      setShowReviewForm(false);
      setReviewComment("");
    } catch (err) { alert(err.response?.data?.message || "Failed to submit review"); }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = product ? `Check out ${product.title} on ForgeVogue — ₹${product.price?.toLocaleString()}` : "";

  const getImgUrl = (img) => img?.startsWith("http") ? img : `http://localhost:5001${img}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center pt-24">
        <div className="w-10 h-10 border-4 border-[var(--border-glass)] border-t-[var(--accent-gold)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center pt-24 px-6 text-center">
        <h2 className="text-2xl font-bold text-[var(--text-main)] mb-4">Artifact Not Found</h2>
        <Link to="/store" className="btn btn--gold rounded-full px-6">Return to Collection</Link>
      </div>
    );
  }

  const renderStars = (rating, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`${size} ${i < Math.round(rating) ? "fill-[var(--accent-gold)] text-[var(--accent-gold)]" : "text-[var(--text-muted)]"}`} />
    ));
  };

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-24 sm:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <Link to="/store" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors mb-6 sm:mb-8">
          <ArrowLeft className="w-4 h-4" /> Return to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[var(--bg-black)]/50 border border-[var(--border-glass)] relative group">
              <ImageMagnifier 
                src={getImgUrl(product.images?.[selectedImage])} 
                alt={product.title}
                className="w-full h-full"
              />
              <button onClick={handleWishlist}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[var(--bg-black)]/60 backdrop-blur flex items-center justify-center border border-[var(--border-glass)] hover:border-[var(--accent-gold)] transition-all">
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-[var(--accent-gold)] text-[var(--accent-gold)]" : "text-white"}`} />
              </button>
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? "border-[var(--accent-gold)]" : "border-[var(--border-glass)] opacity-60 hover:opacity-100"}`}>
                    <img src={getImgUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] bg-[var(--glass-light)] border border-[var(--border-glass)] rounded-full px-3 py-1">{product.category}</span>
                <span className={`text-[10px] uppercase tracking-widest rounded-full px-3 py-1 border ${product.rarity === "Legendary" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : product.rarity === "Ultra Rare" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border-[var(--accent-gold)]/20"}`}>
                  {product.rarity}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-main)] outfit-font leading-tight mb-3">{product.title}</h1>

              {/* Rating */}
              {numReviews > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">{renderStars(avgRating)}</div>
                  <span className="text-sm text-[var(--text-muted)]">{avgRating} ({numReviews} reviews)</span>
                </div>
              )}

              <p className="text-3xl sm:text-4xl font-bold font-mono text-[var(--accent-gold)] mb-2">₹{product.price?.toLocaleString()}</p>
              {product.seller && (
                <Link to={`/seller/${product.seller._id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors">
                  <Shield className="w-3 h-3" /> Verified Originator: {product.seller.name}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Condition", value: product.condition },
                { label: "Year", value: product.yearOfOrigin || "N/A" },
                { label: "Certificate", value: product.authenticityCertificate ? "Yes" : "No" },
                { label: "Stock", value: product.countInStock },
              ].map((d, i) => (
                <div key={i} className="bg-[var(--glass-light)] border border-[var(--border-glass)] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-1">{d.label}</p>
                  <p className="text-sm font-semibold text-[var(--text-main)]">{d.value}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-[var(--text-soft)] leading-relaxed">{product.description}</p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { addToCart({ product: product._id, title: product.title, price: product.price, image: product.images?.[0], qty: 1 }); }}
                className="flex-1 btn btn--gold py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold">
                <ShoppingCart className="w-5 h-5" /> Add to Vault
              </button>
              <button onClick={() => user ? setShowOfferModal(true) : navigate("/login")}
                className="flex-1 btn btn--glass py-3.5 rounded-xl flex items-center justify-center gap-2">
                <Award className="w-5 h-5 text-[var(--accent-gold)]" /> Private Offer
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => user ? setShowInquiryModal(true) : navigate("/login")}
                className="flex-1 btn btn--glass py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4" /> Contact Concierge
              </button>
              <div className="relative flex-1">
                <button onClick={() => setShowShareMenu(!showShareMenu)}
                  className="w-full btn btn--glass py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                {showShareMenu && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-xl shadow-2xl overflow-hidden z-20">
                    <a href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`} target="_blank" rel="noreferrer"
                      className="block px-4 py-2.5 text-sm text-[var(--text-soft)] hover:bg-[var(--glass-light)] transition-colors">WhatsApp</a>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer"
                      className="block px-4 py-2.5 text-sm text-[var(--text-soft)] hover:bg-[var(--glass-light)] transition-colors">Twitter / X</a>
                    <button onClick={() => { navigator.clipboard.writeText(shareUrl); setShowShareMenu(false); alert("Link copied!"); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-soft)] hover:bg-[var(--glass-light)] transition-colors">Copy Link</button>
                    <a href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`}
                      className="block px-4 py-2.5 text-sm text-[var(--text-soft)] hover:bg-[var(--glass-light)] transition-colors">Email</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 max-w-4xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-[var(--border-glass)] pb-4">
            <h2 className="text-2xl font-bold text-[var(--text-main)] outfit-font">Collector Reviews ({numReviews})</h2>
            {user && (
              <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn btn--glass px-5 py-2 text-sm rounded-full">
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl p-5 sm:p-6 mb-8">
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">Your Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setReviewRating(s)} onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110">
                      <Star className={`w-6 h-6 ${s <= (hoverRating || reviewRating) ? "fill-[var(--accent-gold)] text-[var(--accent-gold)]" : "text-[var(--text-muted)]"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none h-24 mb-4 focus:border-[var(--accent-gold)] transition-colors"
                placeholder="Share your experience with this artifact..." />
              <button onClick={handleReviewSubmit} className="btn btn--gold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2">
                <Send className="w-4 h-4" /> Submit Review
              </button>
            </div>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-8 text-sm text-[var(--text-muted)]">No reviews yet. Be the first to share your experience.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-[var(--text-main)] text-sm">{rev.user?.name || "Anonymous"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">{renderStars(rev.rating, "w-3.5 h-3.5")}</div>
                        {rev.isVerifiedPurchase && (
                          <span className="text-[9px] uppercase tracking-wider text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">Verified Purchase</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] shrink-0">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-[var(--text-soft)]">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[var(--text-main)] outfit-font mb-8 border-b border-[var(--border-glass)] pb-4">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`}
                  className="group bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl overflow-hidden hover:border-[var(--accent-gold)]/30 transition-colors">
                  <div className="aspect-square bg-[var(--bg-black)]/50 overflow-hidden">
                    <img src={getImgUrl(p.images?.[0])} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1">{p.category}</p>
                    <p className="text-sm font-semibold text-[var(--text-main)] line-clamp-1 mb-2">{p.title}</p>
                    <p className="font-mono font-bold text-[var(--accent-gold)]">₹{p.price?.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowOfferModal(false)}></div>
          <div className="relative bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-main)] outfit-font">Submit Private Offer</h3>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Offer Amount (₹)</label>
              <input type="number" value={offerAmount} onChange={e => setOfferAmount(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none font-mono focus:border-[var(--accent-gold)]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Message (Optional)</label>
              <textarea value={offerMessage} onChange={e => setOfferMessage(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none h-20 focus:border-[var(--accent-gold)]" />
            </div>
            <button onClick={handleOffer} className="w-full btn btn--gold py-3 rounded-xl">Submit Binding Offer</button>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowInquiryModal(false)}></div>
          <div className="relative bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold text-[var(--text-main)] outfit-font">Contact VIP Concierge</h3>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Subject</label>
              <input type="text" value={inquirySubject} onChange={e => setInquirySubject(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none focus:border-[var(--accent-gold)]" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Message</label>
              <textarea value={inquiryMessage} onChange={e => setInquiryMessage(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-glass)] rounded-lg p-3 text-sm text-[var(--text-main)] outline-none h-24 focus:border-[var(--accent-gold)]" />
            </div>
            <button onClick={handleInquiry} className="w-full btn btn--gold py-3 rounded-xl">Dispatch Request</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

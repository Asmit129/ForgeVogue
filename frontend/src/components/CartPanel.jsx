import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, ShieldCheck, Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const CartPanel = () => {
  const { isCartOpen, setIsCartOpen, cartItems, addToCart, removeFromCart, clearCart, updateQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!user) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[var(--bg-black)]/60 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-main)] border-l border-[var(--border-glass)] z-[70] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-glass)] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-gold)]/10 to-transparent opacity-50"></div>
              <div className="relative z-10 flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[var(--accent-gold)]" />
                <h2 className="text-xl font-semibold text-[var(--text-main)] outfit-font">Your Vault</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="relative z-10 w-8 h-8 rounded-full bg-[var(--glass-light)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--glass-medium)] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items Listing */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                  <div className="w-16 h-16 rounded-full bg-[var(--glass-light)] border border-[var(--border-glass)] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-[var(--text-muted)]" />
                  </div>
                  <h3 className="text-lg font-medium text-[var(--text-main)] mb-2">Your vault is empty</h3>
                  <p className="text-sm text-[var(--text-muted)]">Add rare collectibles to begin your acquisition.</p>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/store");
                    }}
                    className="mt-6 text-[var(--accent-gold)] text-sm font-medium hover:underline"
                  >
                    Explore The Collection
                  </button>
                </div>
              ) : (
                <div>
                <ul className="space-y-6">
                  {cartItems.map((item) => (
                    <li key={item.product} className="flex gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-glass)]">
                      <Link to={`/product/${item.product}`} onClick={() => setIsCartOpen(false)} className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--bg-black)]/50 shrink-0 border border-[var(--border-glass)] block">
                        <img
                          src={item.image?.startsWith('http') ? item.image : `http://localhost:5001${item.image}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <Link to={`/product/${item.product}`} onClick={() => setIsCartOpen(false)} className="text-sm font-medium text-[var(--text-main)] hover:text-[var(--accent-gold)] line-clamp-2 transition-colors">
                            {item.title}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.product)}
                            className="text-[var(--text-muted)] hover:text-red-400 transition-colors shrink-0 p-1"
                            aria-label="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[var(--accent-gold)] mb-2">{item.rarity}</p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-mono text-[var(--text-main)] font-bold tracking-tight">₹{item.price.toLocaleString()}</span>
                          
                          <div className="flex items-center gap-2 bg-[var(--bg-black)] py-1 px-2 rounded-lg border border-[var(--border-glass)]">
                            <button
                              onClick={() => {
                                if (item.qty > 1) updateQty(item.product, item.qty - 1);
                                else removeFromCart(item.product);
                              }}
                              className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 z-10 relative cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs text-[var(--text-main)] font-medium w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.product, item.qty + 1)}
                              className="text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors p-1 z-10 relative cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end pt-2">
                  <button onClick={clearCart} className="text-xs text-red-400/70 hover:text-red-400 font-medium transition-colors">
                    Clear Vault
                  </button>
                </div>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-[var(--bg-black)] border-t border-[var(--border-glass)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-[var(--text-muted)]">
                    <span>Valuation</span>
                    <span className="font-mono text-[var(--text-main)]">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--text-muted)]">
                    <span>Authentication Fees</span>
                    <span className="text-[var(--accent-success)] text-xs uppercase tracking-wider font-semibold bg-[#34d399]/10 px-2 py-0.5 rounded">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[var(--text-main)] pt-3 border-t border-[var(--border-glass)]">
                    <span>Total Acquisition</span>
                    <span className="font-mono text-[var(--accent-gold)]">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Verify</span>
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3"/> Encrypt</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn btn--gold btn--lg rounded-xl shadow-[0_4px_20px_rgba(var(--gold-rgb),0.2)]"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPanel;

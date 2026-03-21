import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, Globe, CreditCard, ShieldCheck, ArrowRight, Lock, Tag, X, CheckCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalPrice = subtotal - discount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center pt-24 px-6 text-center">
        <ShieldCheck className="w-16 h-16 text-[var(--text-muted)] mb-6" />
        <h2 className="text-3xl font-bold text-[var(--text-main)] mb-4 outfit-font">No Assets in Vault</h2>
        <p className="text-[var(--text-muted)] mb-8 max-w-md">You must add authenticated collectibles to your vault before authorizing an acquisition.</p>
        <Link to="/store" className="btn btn--gold rounded-full px-8 py-3">Return to Collection</Link>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await api.post("/coupons/validate", { code: couponCode, orderTotal: subtotal });
      setAppliedCoupon(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      setError("Please fill in all shipping fields");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // 1. Create the order in our DB first
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        title: item.title,
        qty: item.qty,
        image: item.image,
        price: item.price,
      }));

      const orderRes = await api.post("/orders", {
        orderItems,
        shippingAddress,
        couponCode: appliedCoupon?.code || "",
        discount,
      });

      const orderId = orderRes.data._id;

      // 2. Create Razorpay order
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Payment gateway failed to load. Please try again.");
        setLoading(false);
        return;
      }

      const paymentRes = await api.post("/payments/create-order", {
        amount: totalPrice,
        orderId,
      });

      // 3. Open Razorpay checkout
      const options = {
        key: paymentRes.data.key,
        amount: paymentRes.data.amount,
        currency: paymentRes.data.currency,
        name: "ForgeVogue",
        description: `Order #${orderId.slice(-6)}`,
        order_id: paymentRes.data.id,
        handler: async function (response) {
          // 4. Verify payment
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });
            clearCart();
            navigate("/my-orders");
          } catch (err) {
            setError("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: "",
          contact: "",
        },
        theme: {
          color: "#d4af37",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-28 pb-20">
      <div className="wrap max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-[var(--border-glass)]">
          <Lock className="w-6 h-6 text-[var(--accent-gold)]" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-main)] outfit-font">Secure Acquisition</h1>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex gap-3">
            <span className="font-bold">!</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Shipping Form */}
          <div className="lg:col-span-7">
            <h2 className="text-xl font-semibold text-[var(--text-main)] mb-6 flex items-center gap-2 outfit-font">
              <MapPin className="w-5 h-5 text-[var(--accent-gold)]"/> Delivery Destination
            </h2>
            
            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
              <div className="glass-card p-4 sm:p-6 bg-[var(--bg-card)]/80 border-[var(--border-glass)]">
                <div className="space-y-5">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Full Name</label>
                    <input type="text" required placeholder="Asmit Kumar"
                      className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)]"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Secure Address</label>
                    <input type="text" required placeholder="123 Collector's Avenue"
                      className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)]"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">City</label>
                      <input type="text" required placeholder="Mumbai"
                        className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)]"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">PIN Code</label>
                      <input type="text" required placeholder="400001"
                        className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] font-mono"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                      <input type="text" required placeholder="India"
                        className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] pl-10"
                        value={shippingAddress.country}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="glass-card p-4 sm:p-6 bg-[var(--bg-card)]/80 border-[var(--border-glass)]">
                <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2 outfit-font">
                  <CreditCard className="w-5 h-5 text-[var(--accent-gold)]"/> Payment Method
                </h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                  Secure payment via Razorpay — supports UPI, Paytm, Google Pay, PhonePe, Credit/Debit Cards, and Net Banking.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["UPI", "Paytm", "GPay", "Cards", "Net Banking"].map(method => (
                    <span key={method} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--glass-light)] border border-[var(--border-glass)] rounded-full text-[var(--text-soft)]">
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              {/* Coupon */}
              <div className="glass-card p-4 sm:p-6 bg-[var(--bg-card)]/80 border-[var(--border-glass)]">
                <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2 outfit-font">
                  <Tag className="w-5 h-5 text-[var(--accent-gold)]"/> Promo Code
                </h2>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">{appliedCoupon.code}</span>
                      <span className="text-xs text-[var(--text-muted)]">– ₹{appliedCoupon.discount.toLocaleString()} off</span>
                    </div>
                    <button type="button" onClick={removeCoupon} className="text-[var(--text-muted)] hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input type="text" placeholder="Enter code" value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="input-glass flex-1 bg-[var(--bg-black)]/40 border-[var(--border-glass)] font-mono uppercase"
                    />
                    <button type="button" onClick={handleApplyCoupon} disabled={couponLoading}
                      className="btn btn--glass px-4 sm:px-6 shrink-0 text-sm">
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 glass-card p-4 sm:p-6 border-[var(--accent-gold)]/20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--accent-gold)]/5 via-[var(--bg-main)] to-[var(--bg-main)]">
              <h2 className="text-xl font-semibold text-[var(--text-main)] mb-6 outfit-font border-b border-[var(--border-glass)] pb-4">Portfolio Ledger</h2>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4">
                    <img src={item.image?.startsWith('http') ? item.image : `http://localhost:5001${item.image}`} alt={item.title} className="w-14 h-14 sm:w-16 sm:h-16 rounded object-cover border border-[var(--border-glass)]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-main)] font-medium line-clamp-2 leading-snug hover:text-[var(--accent-gold)] transition-colors">
                        <Link to={`/product/${item.product}`}>{item.title}</Link>
                      </p>
                      <div className="flex justify-between mt-2 text-xs text-[var(--text-muted)]">
                        <span>Qty: {item.qty}</span>
                        <span className="font-mono text-[var(--text-main)]">₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-[var(--border-glass)] mb-6">
                <div className="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>Subtotal</span>
                  <span className="font-mono text-[var(--text-main)]">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>Authentication</span>
                  <span className="text-[var(--accent-success)] uppercase tracking-wider text-[10px] font-bold border border-[var(--accent-success)]/30 rounded px-1.5 py-0.5">Complimentary</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-glass)] mb-8 flex justify-between items-end">
                <span className="text-lg font-bold text-[var(--text-main)] outfit-font">Total</span>
                <span className="text-2xl font-bold font-mono text-[var(--accent-gold)]">₹{totalPrice.toLocaleString()}</span>
              </div>

              <button type="submit" form="checkout-form" disabled={loading}
                className="w-full btn btn--gold py-4 rounded-xl flex items-center justify-center gap-2 text-base sm:text-lg shadow-[0_10px_30px_rgba(var(--gold-rgb),0.15)] disabled:opacity-50">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>Pay with Razorpay <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
              
              <p className="text-[10px] text-center text-[var(--text-muted)] mt-4 uppercase tracking-widest">
                Secured by Razorpay · 256-bit SSL Encryption
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;

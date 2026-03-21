import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, CheckCircle, Truck, MapPin, ChevronDown } from "lucide-react";
import api from "../api/axios";

const statusSteps = ["Processing", "Confirmed", "Shipped", "Delivered"];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStepIndex = (status) => {
    const idx = statusSteps.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const getStepIcon = (step, currentIdx, stepIdx) => {
    if (stepIdx < currentIdx) return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (stepIdx === currentIdx) return <Clock className="w-5 h-5 text-[var(--accent-gold)] animate-pulse" />;
    return <div className="w-5 h-5 rounded-full border-2 border-[var(--border-glass)]" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center pt-24">
        <div className="w-10 h-10 border-4 border-[var(--border-glass)] border-t-[var(--accent-gold)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-24 sm:pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8 sm:mb-10 pb-6 border-b border-[var(--border-glass)]">
          <Package className="w-6 h-6 text-[var(--accent-gold)]" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-main)] outfit-font">Acquisition Ledger</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-[var(--text-main)] mb-3">No Acquisitions Yet</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">Your authenticated acquisitions will appear here.</p>
            <Link to="/store" className="btn btn--gold rounded-full px-8 py-3 inline-flex">Explore Collection</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStepIdx = getStepIndex(order.status);
              const isExpanded = expandedOrder === order._id;

              return (
                <div key={order._id} className="bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-xl overflow-hidden">
                  {/* Order Header */}
                  <button onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    className="w-full p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-left hover:bg-[var(--glass-light)] transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border border-[var(--border-glass)] shrink-0">
                        <img src={order.orderItems[0]?.image?.startsWith('http') ? order.orderItems[0].image : `http://localhost:5001${order.orderItems[0]?.image}`}
                          alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-[var(--text-muted)] font-mono">ORD-{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm font-semibold text-[var(--text-main)] truncate">{order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}</p>
                        <p className="text-xs text-[var(--text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-mono font-bold text-[var(--accent-gold)]">₹{order.totalPrice?.toLocaleString()}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          order.isPaid ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        }`}>
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-[var(--border-glass)] p-4 sm:p-5 space-y-6">
                      {/* Timeline */}
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-4">Order Status</h4>
                        <div className="flex items-center justify-between relative">
                          {/* Progress Bar */}
                          <div className="absolute top-2.5 left-0 right-0 h-0.5 bg-[var(--border-glass)]">
                            <div className="h-full bg-[var(--accent-gold)] transition-all duration-500"
                              style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` }} />
                          </div>
                          {statusSteps.map((step, i) => (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-1.5">
                              <div className="bg-[var(--bg-card)] p-0.5">{getStepIcon(step, currentStepIdx, i)}</div>
                              <span className={`text-[10px] font-medium ${i <= currentStepIdx ? "text-[var(--text-main)]" : "text-[var(--text-muted)]"}`}>
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status History */}
                      {order.statusHistory && order.statusHistory.length > 0 && (
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-3">Timeline</h4>
                          <div className="space-y-2">
                            {order.statusHistory.map((hist, i) => (
                              <div key={i} className="flex items-start gap-3 text-xs">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)] mt-1.5 shrink-0"></div>
                                <div>
                                  <span className="font-medium text-[var(--text-main)]">{hist.status}</span>
                                  {hist.note && <span className="text-[var(--text-muted)]"> — {hist.note}</span>}
                                  <p className="text-[var(--text-muted)]">{new Date(hist.timestamp).toLocaleString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      <div>
                        <h4 className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-3">Items</h4>
                        <div className="space-y-3">
                          {order.orderItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <img src={item.image?.startsWith('http') ? item.image : `http://localhost:5001${item.image}`}
                                alt="" className="w-12 h-12 rounded object-cover border border-[var(--border-glass)]" />
                              <div className="flex-1 min-w-0">
                                <Link to={`/product/${item.product}`} className="text-sm text-[var(--text-main)] hover:text-[var(--accent-gold)] truncate block">{item.title}</Link>
                                <p className="text-xs text-[var(--text-muted)]">Qty: {item.qty} × ₹{item.price?.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping */}
                      <div className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-[var(--text-main)]">{order.shippingAddress?.fullName}</p>
                          <p>{order.shippingAddress?.address}, {order.shippingAddress?.city} — {order.shippingAddress?.postalCode}</p>
                          <p>{order.shippingAddress?.country}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

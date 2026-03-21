import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Store from "./pages/Store";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SellItem from "./pages/SellItem";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Journal from "./pages/Journal";
import ArticleDetail from "./pages/ArticleDetail";
import SellerProfile from "./pages/SellerProfile";
import CartPanel from "./components/CartPanel";
import { ToastProvider, useToast } from "./components/Toast";
import { useAuth } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import CustomCursor from "./components/CustomCursor";

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!user.isAdmin) return <Navigate to="/home" replace />;
  return children;
}

function ScrollUI() {
  const [pct, setPct] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const y = window.scrollY || doc.scrollTop || 0;
      const max = Math.max(1, doc.scrollHeight - doc.clientHeight);
      const p = Math.min(100, Math.max(0, (y / max) * 100));
      setPct(p);
      setShowTop(y > 420);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fv-progress" style={{ width: `${pct}%` }} />
      <button
        className={`fv-top ${showTop ? "is-show" : ""}`}
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </>
  );
}

function AppShell() {
  const location = useLocation();
  const { toast } = useToast();
  const [q, setQ] = useState(() => sessionStorage.getItem("search:q") || "");

  useEffect(() => {
    sessionStorage.setItem("search:q", q);
  }, [q]);

  useEffect(() => {
    const onOnline = () => toast("You are back online", "success", 1800);
    const onOffline = () => toast("You are offline", "warn", 2200);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [toast]);

  useEffect(() => {
    if (!sessionStorage.getItem("fv:welcome")) {
      sessionStorage.setItem("fv:welcome", "1");
      toast("Welcome to ForgeVogue — Collector's Exchange", "default", 2200);
    }
  }, [toast]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && e.key === "/") {
        e.preventDefault();
        document.querySelector(".search__input")?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <CustomCursor />
      <Header q={q} setQ={setQ} />
      <CartPanel />

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<Home q={q} />} />
          <Route path="/store" element={<Store />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/seller/:id" element={<SellerProfile />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<ArticleDetail />} />
          <Route path="/about" element={<About />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            }
          />
          <Route
            path="/sell"
            element={
              <RequireAuth>
                <SellItem />
              </RequireAuth>
            }
          />
          <Route
            path="/my-orders"
            element={
              <RequireAuth>
                <MyOrders />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />

          <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
      <ScrollUI />
    </>
  );
}

import { ThemeProvider } from "./context/ThemeContext.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <NotificationProvider>
          <AppShell />
        </NotificationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate(redirect);
      } else {
        setError("Invalid credentials. Please verify your email and password.");
      }
    } catch (err) {
      setError("An error occurred connecting to the secure server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-main)] relative flex items-center justify-center min-h-[calc(100vh-80px)] pt-20 pb-12 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-3xl rounded-full bg-[var(--accent-gold)]/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md px-6 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-dark)] flex items-center justify-center shadow-[0_0_30px_rgba(var(--gold-rgb),0.3)] mb-6">
            <Lock className="w-6 h-6 text-[var(--text-black)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2 outfit-font tracking-wide">Enter the Vault</h1>
          <p className="text-sm text-[var(--text-muted)]">Authenticate your identity to access exclusive collections.</p>
        </div>

        <div className="glass-card p-8 bg-[var(--bg-card)]/80">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <div className="text-red-400 shrink-0 mt-0.5">!</div>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="auth-label text-[var(--text-main)]/70 uppercase tracking-widest text-xs">Registered Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  className="input-glass pl-11 py-3 text-sm bg-[var(--bg-black)]/40"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="collector@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="auth-label text-[var(--text-main)]/70 uppercase tracking-widest text-xs">Security Passkey</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  className="input-glass pl-11 py-3 text-sm bg-[var(--bg-black)]/40 font-mono tracking-widest text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn--gold py-3.5 rounded-xl font-bold flex items-center justify-center mt-2 disabled:opacity-70 shadow-[0_10px_30px_rgba(var(--gold-rgb),0.15)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2">Authorize Access <ArrowRight className="w-4 h-4" /></span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--border-glass)] text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Not a recognized collector?{" "}
              <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-[var(--accent-gold)] font-semibold hover:underline">
                Apply for Access
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center items-center gap-2 text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" /> End-to-End Encrypted Session
        </div>
      </div>
    </div>
  );
};

export default Login;
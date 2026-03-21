import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passkeys do not match.");
      return;
    }

    setLoading(true);
    try {
      const success = await register(name, email, password);
      if (success) {
        navigate(redirect);
      } else {
        setError("Registration failed. Email might already be in use.");
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-4xl rounded-full bg-[var(--accent-gold)]/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl px-6 relative z-10 flex flex-col md:flex-row gap-12 items-center">
        
        {/* Left Side Info */}
        <div className="hidden md:block flex-1">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center mb-6">
            <Award className="w-6 h-6 text-[var(--accent-gold)]" />
          </div>
          <h2 className="text-3xl font-bold text-[var(--text-main)] mb-4 outfit-font">Join The Elite</h2>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">
            Creation of a ForgeVogue portfolio grants you exclusive access to acquire, track, and liquidate the world's most sought-after authenticated collectibles.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-[var(--text-soft)]">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)]" /> Guaranteed Authenticity
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--text-soft)]">
              <Lock className="w-4 h-4 text-[var(--accent-gold)]" /> Encrypted Escrow Transactions
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--text-soft)]">
              <UserPlus className="w-4 h-4 text-[var(--accent-gold)]" /> Private Seller Network
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full max-w-md">
          <div className="glass-card p-8 bg-[var(--bg-card)]/80">
            <h3 className="text-2xl font-bold text-[var(--text-main)] mb-6 outfit-font md:hidden">Apply for Access</h3>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <div className="text-red-400 shrink-0 mt-0.5">!</div>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="auth-label text-[var(--text-main)]/70 uppercase tracking-widest text-xs">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    className="input-glass pl-11 py-3 border-[var(--border-glass)] bg-[var(--bg-black)]/40 text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="auth-label text-[var(--text-main)]/70 uppercase tracking-widest text-xs">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    className="input-glass pl-11 py-3 border-[var(--border-glass)] bg-[var(--bg-black)]/40 text-sm"
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
                    className="input-glass pl-11 py-3 border-[var(--border-glass)] bg-[var(--bg-black)]/40 font-mono tracking-widest text-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="auth-label text-[var(--text-main)]/70 uppercase tracking-widest text-xs">Confirm Passkey</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="password"
                    className="input-glass pl-11 py-3 border-[var(--border-glass)] bg-[var(--bg-black)]/40 font-mono tracking-widest text-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn--gold py-3.5 rounded-xl font-bold flex items-center justify-center mt-4 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <span className="flex items-center gap-2">Initialize Portfolio <ArrowRight className="w-4 h-4" /></span>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[var(--border-glass)] text-center">
              <p className="text-sm text-[var(--text-muted)]">
                Already have an authorized portfolio?{" "}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-[var(--accent-gold)] font-semibold hover:underline">
                  Enter Vault
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;

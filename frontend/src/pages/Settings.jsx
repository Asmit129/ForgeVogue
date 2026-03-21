import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Save, Camera, ShieldAlert, Settings as SettingsIcon } from "lucide-react";
import api from "../api/axios";

const Settings = () => {
  const { user, setUser } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState("");
  
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError("");

    if (password && password !== confirmPassword) {
      setError("Passkeys do not match.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (password) formData.append("password", password);
      if (avatarFile) formData.append("avatar", avatarFile);

      const { data } = await api.put("/auth/profile", formData);
      setUser(data);
      localStorage.setItem("fv:auth", JSON.stringify(data));
      setMessage("Configuration updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-28 pb-20">
      <div className="wrap max-w-3xl">
        <div className="flex items-center gap-3 mb-10 border-b border-[var(--border-glass)] pb-6">
          <SettingsIcon className="w-8 h-8 text-[var(--accent-gold)]" />
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-main)] outfit-font">Account Configuration</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">Manage your secure portfolio identity credentials.</p>
          </div>
        </div>

        <div className="glass-card bg-[var(--bg-card)]/80 p-8 border-[var(--border-glass)] relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-gold)]/5 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          
          {message && (
            <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex gap-3 items-center">
              <ShieldAlert className="w-4 h-4" /> {message}
            </div>
          )}
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex gap-3 items-center">
              <ShieldAlert className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-12 relative z-10">
            {/* Avatar section */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-dark)] p-1 shadow-[0_0_20px_rgba(var(--gold-rgb),0.2)] mb-4">
                <img 
                  src={previewAvatar || (user?.avatar?.startsWith('http') ? user.avatar : (user?.avatar ? `http://localhost:5001${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=d4af37&color=000`))} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full bg-[var(--bg-black)]/50"
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user?.name + "&background=d4af37&color=000" }}
                />
              </div>
              <input type="file" id="avatarUpload" className="hidden" accept="image/*" onChange={(e) => {
                if (e.target.files[0]) {
                  setAvatarFile(e.target.files[0]);
                  setPreviewAvatar(URL.createObjectURL(e.target.files[0]));
                }
              }} />
              <label htmlFor="avatarUpload" className="text-xs text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)] uppercase tracking-widest flex items-center gap-1 cursor-pointer border border-[var(--accent-gold)]/50 hover:bg-[var(--accent-gold)]/10 rounded-full px-4 py-1.5 transition-colors">
                <Camera className="w-3 h-3" /> Update Image
              </label>
            </div>

            <form onSubmit={submitHandler} className="flex-1 space-y-6">
              
              <div className="space-y-5 border-b border-[var(--border-glass)] pb-8">
                <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-widest flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--accent-gold)]" /> Core Identity
                </h3>
                
                <div>
                  <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Full Legal Name</label>
                  <input
                    type="text"
                    className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Authorized Email</label>
                  <input
                    type="email"
                    className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-5 pt-2">
                <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[var(--accent-gold)]" /> Security Enhancements
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-4">Leave passkey fields blank to retain current settings.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">New Passkey</label>
                    <input
                      type="password"
                      className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] font-mono tracking-widest"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Confirm Passkey</label>
                    <input
                      type="password"
                      className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] font-mono tracking-widest"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn--gold px-8 py-3 rounded-xl shadow-[0_10px_30px_rgba(var(--gold-rgb),0.15)] flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Configuration</>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, ShieldAlert, ArrowRight, Tag, HelpCircle, CheckCircle, ShieldCheck } from "lucide-react";
import api from "../api/axios";

const SellItem = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Rare Sneakers",
    rarity: "Rare",
    condition: "Excellent",
    yearOfOrigin: "",
    authenticityCertificate: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const categories = [
    "Rare Sneakers",
    "Classic Watches",
    "Vintage Books",
    "Limited Edition Art",
    "Signed Memorabilia",
    "Antique Collectibles",
    "Vinyl Records",
  ];

  const handleInputChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image strictly cannot exceed 5MB.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError("High-resolution imaging is mandatory for the authentication process.");
      return;
    }

    setLoading(true);
    setError("");

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    data.append("image", imageFile);

    try {
      await api.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Transmission failed. Secure channel error.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center p-6 text-center">
        <div className="glass-card max-w-lg w-full p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6 relative z-10" />
          <h2 className="text-3xl font-bold text-[var(--text-main)] mb-4 outfit-font relative z-10">Intake Received</h2>
          <p className="text-[var(--text-muted)] mb-8 max-w-sm mx-auto relative z-10 leading-relaxed">
            Your asset has been securely transmitted to our expert network. Physical authentication and provenance verification may take 3-5 business days. You will be notified of the status.
          </p>
          <button onClick={() => navigate("/profile")} className="btn btn--glass px-8 py-3 rounded-full relative z-10 w-full sm:w-auto">
            View My Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-main)] min-h-screen pt-28 pb-20 relative">
      {/* Glow effect */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--accent-gold)]/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/4"></div>

      <div className="wrap max-w-5xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--glass-light)] border border-[var(--border-glass)] text-xs text-[var(--accent-gold)] font-medium tracking-widest uppercase mb-4">
              <Tag className="w-4 h-4" /> Liquidation Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-main)] mb-4 outfit-font">Liquidate an Artifact</h1>
            <p className="text-[var(--text-muted)] max-w-xl">
              Submit your rare collectibles for physical authentication and placement onto the global ForgeVogue marketplace.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex gap-3 items-center">
            <ShieldAlert className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="glass-card bg-[var(--bg-card)]/80 p-8 md:p-10 border-[var(--border-glass)]">
              
              <div className="space-y-8">
                {/* Visual Documentation */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-widest mb-4 flex items-center justify-between">
                    Visual Documentation
                    <HelpCircle className="w-4 h-4 text-[var(--text-muted)] cursor-help" title="High resolution imagery accelerates the preliminary vetting process." />
                  </h3>
                  
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className={`w-full aspect-[21/9] sm:aspect-[21/7] rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                      imagePreview ? 'border-transparent bg-[var(--bg-black)]/50' : 'border-[var(--border-glass)] bg-[var(--glass-light)] group-hover:bg-[var(--glass-medium)] group-hover:border-[var(--accent-gold)]/50'
                    }`}>
                      {imagePreview ? (
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-[var(--bg-card)]/80 text-[var(--text-main)] text-sm font-medium px-4 py-2 rounded-full backdrop-blur-md">Replace Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-6">
                          <div className="w-16 h-16 rounded-full bg-[var(--bg-black)]/50 flex items-center justify-center mx-auto mb-4 border border-[var(--border-glass)] group-hover:border-[var(--accent-gold)]/50 transition-colors">
                            <UploadCloud className="w-6 h-6 text-[var(--accent-gold)]" />
                          </div>
                          <p className="text-[var(--text-main)] font-medium mb-1">Select high-resolution image</p>
                          <p className="text-xs text-[var(--text-muted)] max-w-[250px] mx-auto">Upload front-facing, perfectly lit imagery (Max 5MB • JPG, PNG).</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Core Attributes */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-widest mb-4">Core Attributes</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Artifact Nomenclature (Title)</label>
                      <input
                        type="text"
                        name="title"
                        required
                        placeholder="e.g. Rolex Daytona Ref. 6239"
                        className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] py-3.5"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Detailed Provenance (Description)</label>
                      <textarea
                        name="description"
                        required
                        rows="4"
                        placeholder="Detail the history, origin, and exact condition of the artifact..."
                        className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] py-3.5 resize-none custom-scrollbar"
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div>
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Proposed Valuation (USD)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-mono">₹</span>
                          <input
                            type="number"
                            name="price"
                            required
                            min="1"
                            className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] pl-8 font-mono tracking-wider py-3.5"
                            value={formData.price}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Year of Origin</label>
                        <input
                          type="text"
                          name="yearOfOrigin"
                          placeholder="e.g. 1985"
                          className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] font-mono tracking-wider py-3.5"
                          value={formData.yearOfOrigin}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Classifications */}
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-main)] uppercase tracking-widest mb-4">Classifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Category</label>
                      <select
                        name="category"
                        className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] py-3.5 appearance-none cursor-pointer"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        {categories.map(c => <option key={c} value={c} className="bg-[var(--bg-card)]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Condition Grading</label>
                      <select
                        name="condition"
                        className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] py-3.5 appearance-none cursor-pointer"
                        value={formData.condition}
                        onChange={handleInputChange}
                      >
                        {["Mint", "Near Mint", "Excellent", "Good", "Fair"].map(c => <option key={c} value={c} className="bg-[var(--bg-card)]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Rarity Index</label>
                      <select
                        name="rarity"
                        className="input-glass w-full bg-[var(--bg-black)]/40 border-[var(--border-glass)] py-3.5 appearance-none cursor-pointer"
                        value={formData.rarity}
                        onChange={handleInputChange}
                      >
                         {["Rare", "Ultra Rare", "Legendary"].map(r => <option key={r} value={r} className="bg-[var(--bg-card)]">{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="pt-4 border-t border-[var(--border-glass)]">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-start mt-0.5">
                      <input
                        type="checkbox"
                        name="authenticityCertificate"
                        className="sr-only"
                        checked={formData.authenticityCertificate}
                        onChange={handleInputChange}
                      />
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        formData.authenticityCertificate ? 'bg-[var(--accent-gold)] border-[var(--accent-gold)]' : 'bg-[var(--bg-black)] border-[var(--border-glass-strong)] group-hover:border-[var(--accent-gold)]/50'
                      }`}>
                        {formData.authenticityCertificate && <svg className="w-3 h-3 text-[var(--text-black)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[var(--text-main)] font-medium mb-1">I possess official documentation/certificates.</h4>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">Checking this indicates you can physically provide provenance documentation to our appraisers upon request.</p>
                    </div>
                  </label>
                </div>

              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn btn--gold py-4 rounded-xl text-lg font-bold shadow-[0_10px_30px_rgba(var(--gold-rgb),0.15)] flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    <>Submit for Authentication <ArrowRight className="w-5 h-5"/></>
                  )}
                </button>
              </div>

            </form>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="glass-card bg-[var(--bg-card)]/60 border border-[var(--accent-gold)]/20 p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-gold)]/10 blur-[40px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4 outfit-font flex items-center gap-2 relative z-10"><ShieldCheck className="w-5 h-5 text-[var(--accent-gold)]"/> The Process</h3>
                <ul className="space-y-4 text-sm text-[var(--text-muted)] relative z-10">
                  <li className="flex gap-3"><span className="text-[var(--accent-gold)] font-bold">1</span> <span>Submit digital intake forms & high-res imagery.</span></li>
                  <li className="flex gap-3"><span className="text-[var(--accent-gold)] font-bold">2</span> <span>Initial vetting by digital appraisers (24-48 hrs).</span></li>
                  <li className="flex gap-3"><span className="text-[var(--accent-gold)] font-bold">3</span> <span>Secure transit to physical vault facility.</span></li>
                  <li className="flex gap-3"><span className="text-[var(--accent-gold)] font-bold">4</span> <span>In-person authentication & grading by specialists.</span></li>
                  <li className="flex gap-3"><span className="text-[var(--accent-gold)] font-bold">5</span> <span>Induction into global automated marketplace.</span></li>
                </ul>
              </div>
              
               <div className="glass-card bg-[var(--bg-black)]/40 border border-[var(--border-glass)] p-6 rounded-2xl">
                 <h4 className="text-[var(--text-main)] font-medium mb-2 text-sm">Escrow Commision</h4>
                 <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                   ForgeVogue retains an industry-low 8% commission on final liquidation value to cover comprehensive insurance, deep authentication, and wire transfer processing.
                 </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellItem;

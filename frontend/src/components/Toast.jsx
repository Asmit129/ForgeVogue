import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

const variantDot = (variant) => {
  if (variant === "success") return "#198754";
  if (variant === "warn") return "#ffc107";
  if (variant === "error") return "#dc3545";
  return "var(--dark)";
};

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const toast = useCallback((message, variant = "default", ms = 2200) => {
    const id = crypto?.randomUUID?.() || String(Date.now() + Math.random());
    setItems((p) => [...p, { id, message, variant }]);
    setTimeout(() => {
      setItems((p) => p.filter((x) => x.id !== id));
    }, ms);
  }, []);

  const remove = useCallback((id) => {
    setItems((p) => p.filter((x) => x.id !== id));
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fv-toastHost" aria-live="polite">
        {items.map((t) => (
          <div className="fv-toast" role="status" key={t.id}>
            <div className="fv-toastLeft">
              <span className="fv-toastDot" style={{ background: variantDot(t.variant) }} />
              <div>{t.message}</div>
            </div>
            <button className="fv-toastClose" onClick={() => remove(t.id)} aria-label="Close notification">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
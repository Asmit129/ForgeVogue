import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const cartKey = user && user._id ? `fv:cart_${user._id}` : "fv:cart_guest";

  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(cartKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart instantly upon account login/logout swap
  useEffect(() => {
    try {
      const raw = localStorage.getItem(cartKey);
      setCartItems(raw ? JSON.parse(raw) : []);
    } catch {
      setCartItems([]);
    }
  }, [cartKey]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || "",
          qty: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.product !== id));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.product === id ? { ...i, qty } : i))
      );
    }
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((i) => i.product !== id));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = useMemo(
    () => cartItems.reduce((acc, i) => acc + i.qty, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () => cartItems.reduce((acc, i) => acc + i.qty * i.price, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        isCartOpen, 
        setIsCartOpen, 
        addToCart, 
        updateQty, 
        removeFromCart, 
        clearCart, 
        cartCount, 
        cartTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

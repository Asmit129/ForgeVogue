import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const CART_KEY = "fv:cart";
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

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

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext();
const LS_KEY = "traveltour_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  // add: gộp item cùng tour + cùng option (theo key)
  const add = (tour, opt = {}) => {
    const key = `${tour.id}-${opt.checkIn || ""}-${opt.checkOut || ""}-${opt.adults || 1}`;
    setItems(prev => {
      const i = prev.findIndex(x => x.key === key);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: (next[i].qty || 1) + (opt.qty || 1) };
        return next;
      }
      return [
        ...prev,
        {
          key,
          id: tour.id,
          name: tour.name,
          img: tour.img,
          price: tour.price,
          qty: opt.qty || 1,
          meta: { checkIn: opt.checkIn, checkOut: opt.checkOut, adults: opt.adults || 1 },
        },
      ];
    });
  };

  const remove = (key) => setItems(prev => prev.filter(x => x.key !== key));
  const updateQty = (key, qty) =>
    setItems(prev => prev.map(x => (x.key === key ? { ...x, qty: Math.max(1, Number(qty) || 1) } : x)));
  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0),
    [items]
  );

  return (
    <CartCtx.Provider value={{ items, add, remove, updateQty, clear, subtotal }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);

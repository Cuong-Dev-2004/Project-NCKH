export const LS_ORDERS   = "orders_tt_v1";
export const LS_BOOKINGS = "bookings_admin_demo_v1"; // trùng với trang admin đang dùng

export const genCode = (prefix = "BK") => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rnd = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}-${y}${m}${day}-${rnd}`;
};

export function countDaysInclusive(checkIn, checkOut) {
  if (!checkIn) return 1;
  const s = new Date(checkIn);
  const e = new Date(checkOut || checkIn);
  const ONE = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.round((e - s) / ONE) + 1);
}

export function saveOrderAndBookings({ order, bookings }) {
  // Orders
  const oRaw = localStorage.getItem(LS_ORDERS);
  const oList = oRaw ? JSON.parse(oRaw) : [];
  oList.push(order);
  localStorage.setItem(LS_ORDERS, JSON.stringify(oList));

  // Bookings (để /admin/bookings đọc được luôn)
  const bRaw = localStorage.getItem(LS_BOOKINGS);
  const bList = bRaw ? JSON.parse(bRaw) : [];
  bList.push(...bookings);
  localStorage.setItem(LS_BOOKINGS, JSON.stringify(bList));
}

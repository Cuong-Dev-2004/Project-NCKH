export function vnd(n) {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(n || 0);
  } catch {
    return `${(n || 0).toLocaleString("vi-VN")} đ`;
  }
}

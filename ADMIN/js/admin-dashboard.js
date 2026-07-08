/**
 * admin-dashboard.js
 * Mengisi konten halaman dashboard.html: kartu statistik, tabel pesanan
 * terbaru, dan tabel produk dengan stok menipis.
 */

function categoryLabelSafe(value) {
  const found = CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
}

function statusPillClass(status) {
  const map = {
    menunggu_pembayaran: "pill-yellow",
    diproses: "pill-blue",
    dikemas: "pill-purple",
    dikirim: "pill-blue",
    selesai: "pill-green",
    dibatalkan: "pill-red",
    cod: "pill-gray",
    paid: "pill-green",
    pending: "pill-yellow",
  };
  return map[status] || "pill-gray";
}

function paymentStatusLabel(order) {
  if (order.paymentMethod === "cod") return "COD";
  if (order.paymentStatus === "paid") return "Lunas";
  if (order.paymentStatus === "pending") return "Menunggu";
  return order.paymentStatus;
}

function orderStatusLabel(status) {
  return (typeof ORDER_STATUS_LABELS !== "undefined" && ORDER_STATUS_LABELS[status]) || status;
}

function renderStatCards() {
  const stats = getOrderStats();
  const grid = document.getElementById("stat-grid");
  grid.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon brown"><i class="fas fa-receipt"></i></div>
      <div>
        <div class="stat-value">${stats.totalOrders}</div>
        <div class="stat-label">Total Pesanan</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon orange"><i class="fas fa-hourglass-half"></i></div>
      <div>
        <div class="stat-value">${stats.pendingPayment}</div>
        <div class="stat-label">Menunggu Pembayaran</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon blue"><i class="fas fa-truck"></i></div>
      <div>
        <div class="stat-value">${stats.processing}</div>
        <div class="stat-label">Sedang Diproses/Dikirim</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green"><i class="fas fa-sack-dollar"></i></div>
      <div>
        <div class="stat-value">${formatRupiah(stats.totalRevenue)}</div>
        <div class="stat-label">Total Pendapatan</div>
      </div>
    </div>
  `;
}

function renderRecentOrders() {
  const orders = getOrders().slice(0, 6);
  const tbody = document.getElementById("recent-orders-body");

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-inbox"></i><p>Belum ada pesanan masuk.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = orders
    .map(
      (o) => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer.name}</td>
      <td>${formatRupiah(o.total)}</td>
      <td><span class="pill ${statusPillClass(o.paymentMethod === "cod" ? "cod" : o.paymentStatus)}">${paymentStatusLabel(o)}</span></td>
      <td><span class="pill ${statusPillClass(o.orderStatus)}">${orderStatusLabel(o.orderStatus)}</span></td>
      <td>${new Date(o.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
    </tr>`
    )
    .join("");
}

function renderLowStock() {
  const sorted = [...PRODUCTS].sort((a, b) => a.stock - b.stock).slice(0, 5);
  const tbody = document.getElementById("low-stock-body");

  tbody.innerHTML = sorted
    .map(
      (p) => `
    <tr>
      <td style="display:flex; align-items:center; gap:0.7rem;">
        <img src="../${p.image}" class="thumb" alt="${p.name}" onerror="this.style.visibility='hidden'" />
        <span>${p.name}</span>
      </td>
      <td>${categoryLabelSafe(p.category)}</td>
      <td><span class="pill ${p.stock <= 12 ? "pill-red" : "pill-green"}">${p.stock} pcs</span></td>
      <td>${formatRupiah(p.price)}</td>
    </tr>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminLayout();
  renderStatCards();
  renderRecentOrders();
  renderLowStock();
});

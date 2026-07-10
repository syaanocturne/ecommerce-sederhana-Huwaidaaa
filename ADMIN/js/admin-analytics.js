/**
 * admin-analytics.js
 * Logika halaman analytics.html: menghitung statistik penjualan &
 * profitabilitas dari data pesanan (ORDERS) yang tersimpan di localStorage.
 *
 * Definisi "pendapatan" di sini: total nilai pesanan yang sudah dianggap
 * lunas (paymentStatus === "paid") ATAU pesanan COD yang sudah "selesai"
 * (barang diterima & dibayar tunai). Pesanan yang masih menunggu konfirmasi
 * pembayaran (ShopeePay belum diverifikasi) dan pesanan yang dibatalkan
 * TIDAK dihitung sebagai pendapatan.
 */

function isRevenueCountable(order) {
  if (order.orderStatus === "dibatalkan") return false;
  if (order.paymentMethod === "cod") return order.orderStatus === "selesai";
  return order.paymentStatus === "paid";
}

function filterOrdersByPeriod(orders, periodDays) {
  if (periodDays === "all") return orders;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Number(periodDays));
  return orders.filter((o) => new Date(o.date) >= cutoff);
}

function computeAnalytics(periodDays) {
  const allOrders = getOrders();
  const orders = filterOrdersByPeriod(allOrders, periodDays);
  const revenueOrders = orders.filter(isRevenueCountable);

  const totalRevenue = revenueOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = revenueOrders.length ? totalRevenue / revenueOrders.length : 0;

  // Agregasi per produk
  const productMap = {}; // id -> { name, qty, revenue }
  revenueOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productMap[item.id]) {
        productMap[item.id] = { id: item.id, name: item.name, qty: 0, revenue: 0 };
      }
      productMap[item.id].qty += item.qty;
      productMap[item.id].revenue += item.price * item.qty;
    });
  });
  const productStats = Object.values(productMap);

  // Agregasi per metode pembayaran
  const paymentMap = {};
  revenueOrders.forEach((o) => {
    const key = o.paymentMethod;
    if (!paymentMap[key]) paymentMap[key] = { method: key, count: 0, revenue: 0 };
    paymentMap[key].count += 1;
    paymentMap[key].revenue += o.total;
  });

  return {
    totalRevenue,
    totalOrders,
    revenueOrderCount: revenueOrders.length,
    avgOrderValue,
    productStats,
    paymentStats: Object.values(paymentMap),
  };
}

function paymentMethodLabelAnalytics(method) {
  const labels = { cod: "COD", shopeepay: "ShopeePay" };
  return labels[method] || method;
}

function categoryLabelSafe(value) {
  const found = CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
}

function renderAnalyticsStatCards(data) {
  const grid = document.getElementById("analytics-stat-grid");
  grid.innerHTML = `
    <div class="stat-card">
      <div class="stat-icon green"><i class="fas fa-sack-dollar"></i></div>
      <div>
        <div class="stat-value">${formatRupiah(data.totalRevenue)}</div>
        <div class="stat-label">Total Pendapatan</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon brown"><i class="fas fa-receipt"></i></div>
      <div>
        <div class="stat-value">${data.totalOrders}</div>
        <div class="stat-label">Total Pesanan (periode ini)</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon blue"><i class="fas fa-calculator"></i></div>
      <div>
        <div class="stat-value">${formatRupiah(Math.round(data.avgOrderValue))}</div>
        <div class="stat-label">Rata-rata Nilai Pesanan</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon orange"><i class="fas fa-boxes-stacked"></i></div>
      <div>
        <div class="stat-value">${data.productStats.reduce((s, p) => s + p.qty, 0)}</div>
        <div class="stat-label">Total Item Terjual (pcs)</div>
      </div>
    </div>
  `;
}

function renderRankBarList(containerId, items, valueKey, formatFn) {
  const container = document.getElementById(containerId);
  if (items.length === 0) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><p>Belum ada data penjualan untuk periode ini.</p></div>`;
    return;
  }
  const maxValue = Math.max(...items.map((i) => i[valueKey]));
  container.innerHTML = items
    .map(
      (item, idx) => `
    <div class="rank-bar-row">
      <div class="rank-bar-number">${idx + 1}</div>
      <div class="rank-bar-main">
        <div class="rank-bar-label">
          <span>${item.name}</span>
          <span>${formatFn(item[valueKey])}</span>
        </div>
        <div class="rank-bar-track">
          <div class="rank-bar-fill" style="width:${maxValue ? (item[valueKey] / maxValue) * 100 : 0}%;"></div>
        </div>
      </div>
    </div>`
    )
    .join("");
}

function renderPaymentBreakdown(data) {
  const tbody = document.getElementById("payment-breakdown-body");
  if (data.paymentStats.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><i class="fas fa-inbox"></i><p>Belum ada data.</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = data.paymentStats
    .sort((a, b) => b.revenue - a.revenue)
    .map((p) => {
      const contribution = data.totalRevenue ? ((p.revenue / data.totalRevenue) * 100).toFixed(1) : "0";
      return `
      <tr>
        <td><strong>${paymentMethodLabelAnalytics(p.method)}</strong></td>
        <td>${p.count}</td>
        <td>${formatRupiah(p.revenue)}</td>
        <td>${contribution}%</td>
      </tr>`;
    })
    .join("");
}

function renderProductBreakdown(data) {
  const tbody = document.getElementById("product-breakdown-body");
  const sorted = [...data.productStats].sort((a, b) => b.revenue - a.revenue);

  if (sorted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-inbox"></i><p>Belum ada data penjualan.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = sorted
    .map((p) => {
      const product = PRODUCTS.find((pr) => pr.id === p.id);
      return `
      <tr>
        <td>${p.name}</td>
        <td>${product ? categoryLabelSafe(product.category) : "-"}</td>
        <td>${p.qty}</td>
        <td>${formatRupiah(p.revenue)}</td>
        <td>${product ? product.stock + " pcs" : "-"}</td>
      </tr>`;
    })
    .join("");
}

function renderAnalyticsPage() {
  const periodDays = document.getElementById("filter-period").value;
  const data = computeAnalytics(periodDays);

  renderAnalyticsStatCards(data);

  const topSelling = [...data.productStats].sort((a, b) => b.qty - a.qty).slice(0, 5);
  renderRankBarList("top-selling-list", topSelling, "qty", (v) => `${v} pcs`);

  const topRevenue = [...data.productStats].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  renderRankBarList("top-revenue-list", topRevenue, "revenue", (v) => formatRupiah(v));

  renderPaymentBreakdown(data);
  renderProductBreakdown(data);
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminLayout();
  renderAnalyticsPage();
  document.getElementById("filter-period").addEventListener("change", renderAnalyticsPage);
});

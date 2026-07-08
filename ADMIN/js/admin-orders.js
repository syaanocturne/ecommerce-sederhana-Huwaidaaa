/**
 * admin-orders.js
 * Logika halaman orders.html: render tabel pesanan, filter status, cari,
 * ubah status pesanan (diproses -> dikemas -> dikirim -> selesai), tandai
 * lunas manual untuk pesanan yang masih menunggu pembayaran, dan detail order.
 */

function statusPillClassLocal(status) {
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

function paymentLabelLocal(order) {
  const methodLabels = { cod: "COD", midtrans: "Midtrans", xendit: "Xendit" };
  return methodLabels[order.paymentMethod] || order.paymentMethod;
}

function nextStatusInfo(order) {
  const flow = ["diproses", "dikemas", "dikirim", "selesai"];
  const idx = flow.indexOf(order.orderStatus);
  if (idx === -1 || idx === flow.length - 1) return null;
  const nextStatus = flow[idx + 1];
  const nextLabels = {
    dikemas: "Tandai Dikemas",
    dikirim: "Tandai Dikirim",
    selesai: "Tandai Selesai",
  };
  return { nextStatus, label: nextLabels[nextStatus] };
}

function renderOrdersTable() {
  const statusFilter = document.getElementById("filter-status").value;
  const searchTerm = document.getElementById("order-search").value.toLowerCase().trim();
  const tbody = document.getElementById("orders-table-body");

  let orders = getOrders();
  document.getElementById("order-count").textContent = orders.length;

  if (statusFilter !== "all") {
    orders = orders.filter((o) => o.orderStatus === statusFilter);
  }
  if (searchTerm) {
    orders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(searchTerm) ||
        o.customer.name.toLowerCase().includes(searchTerm)
    );
  }

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fas fa-inbox"></i><p>Tidak ada pesanan yang cocok.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = orders
    .map((o) => {
      const itemSummary = o.items.map((i) => `${i.name} x${i.qty}`).join(", ");
      const nextInfo = nextStatusInfo(o);
      const showTrackingBtn =
        o.paymentMethod !== "cod" && ["dikirim", "selesai"].includes(o.orderStatus);

      let actionButtons = `<button class="icon-btn" title="Detail" onclick="openOrderDetail('${o.id}')"><i class="fas fa-eye"></i></button>`;

      if (o.orderStatus === "dibatalkan") {
        // tidak ada aksi lanjutan untuk pesanan yang dibatalkan
      } else if (o.orderStatus === "menunggu_pembayaran") {
        actionButtons += ` <button class="btn btn-outline btn-sm" onclick="handleMarkPaid('${o.id}')"><i class="fas fa-check"></i> Tandai Lunas</button>`;
      } else if (nextInfo) {
        actionButtons += ` <button class="btn btn-brown btn-sm" onclick="handleAdvanceStatus('${o.id}', '${nextInfo.nextStatus}')"><i class="fas fa-forward"></i> ${nextInfo.label}</button>`;
      }

      if (showTrackingBtn) {
        actionButtons += ` <a href="tracking.html?order=${o.id}" class="btn btn-outline btn-sm"><i class="fas fa-truck-fast"></i> Tracking</a>`;
      }

      return `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.customer.name}<br><span style="font-size:0.75rem; color:#a3876a;">${o.customer.phone}</span></td>
        <td style="max-width:220px; font-size:0.82rem;">${itemSummary}</td>
        <td>${formatRupiah(o.total)}</td>
        <td><span class="pill ${statusPillClassLocal(o.paymentMethod === "cod" ? "cod" : o.paymentStatus)}">${paymentLabelLocal(o)}${o.paymentMethod !== "cod" ? " - " + (o.paymentStatus === "paid" ? "Lunas" : "Pending") : ""}</span></td>
        <td><span class="pill ${statusPillClassLocal(o.orderStatus)}">${ORDER_STATUS_LABELS[o.orderStatus] || o.orderStatus}</span></td>
        <td style="font-size:0.8rem;">${new Date(o.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
        <td style="white-space:nowrap;">${actionButtons}</td>
      </tr>`;
    })
    .join("");
}

function handleAdvanceStatus(orderId, nextStatus) {
  updateOrderStatus(orderId, nextStatus);
  showNotification(`Status pesanan ${orderId} diubah ke "${ORDER_STATUS_LABELS[nextStatus]}"`, "success");
  renderOrdersTable();
}

function handleMarkPaid(orderId) {
  markOrderPaid(orderId);
  showNotification(`Pesanan ${orderId} ditandai lunas`, "success");
  renderOrdersTable();
}

function openOrderDetail(orderId) {
  const order = getOrderById(orderId);
  if (!order) return;

  document.getElementById("detail-order-id").textContent = order.id;
  const itemsHTML = order.items
    .map((i) => `<div style="display:flex; justify-content:space-between; padding:0.3rem 0;"><span>${i.name} &times; ${i.qty}</span><span>${formatRupiah(i.price * i.qty)}</span></div>`)
    .join("");

  document.getElementById("order-detail-content").innerHTML = `
    <p><strong>${order.customer.name}</strong> &middot; ${order.customer.phone}</p>
    ${order.customer.email ? `<p style="margin:0.2rem 0; font-size:0.85rem; color:#8a6d4b;">${order.customer.email}</p>` : ""}
    <p style="margin:0.3rem 0 1rem;">${order.customer.address}, ${order.customer.city} ${order.customer.postalCode}</p>
    <div style="background:var(--cream); border-radius:10px; padding:0.8rem; margin-bottom:1rem;">
      ${itemsHTML}
      <hr style="border:none; border-top:1px dashed rgba(139,69,19,0.2); margin:0.5rem 0;" />
      <div style="display:flex; justify-content:space-between;"><span>Ongkir</span><span>${formatRupiah(order.shipping)}</span></div>
      <div style="display:flex; justify-content:space-between; font-weight:700; margin-top:0.3rem;"><span>Total</span><span>${formatRupiah(order.total)}</span></div>
    </div>
    <p><strong>Metode Bayar:</strong> ${paymentLabelLocal(order)}</p>
    <p><strong>Status:</strong> ${ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}</p>
    ${order.trackingNumber ? `<p><strong>No. Resi:</strong> ${order.trackingNumber} (${order.courier})</p>` : ""}
  `;

  document.getElementById("order-detail-modal").classList.add("show");
}

function closeOrderDetailModal() {
  document.getElementById("order-detail-modal").classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminLayout();
  renderOrdersTable();

  document.getElementById("filter-status").addEventListener("change", renderOrdersTable);
  document.getElementById("order-search").addEventListener("input", renderOrdersTable);
});

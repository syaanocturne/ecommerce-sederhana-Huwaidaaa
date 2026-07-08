/**
 * admin-tracking.js
 * Menampilkan status pengiriman untuk satu pesanan (?order=<orderId>).
 * Sesuai permintaan bisnis: fitur tracking hanya relevan untuk pesanan
 * dengan pembayaran NON-COD (QRIS/BRIVA/ShopeePay), karena pesanan COD
 * dibayar langsung saat barang tiba dan tidak memerlukan estimasi
 * pengiriman terpisah dari status pesanan biasa.
 */

const TRACKING_FLOW = [
  { status: "diproses", label: "Pesanan Diproses", icon: "fa-receipt" },
  { status: "dikemas", label: "Dikemas", icon: "fa-box" },
  { status: "dikirim", label: "Dalam Pengiriman", icon: "fa-truck" },
  { status: "selesai", label: "Diterima", icon: "fa-circle-check" },
];

function getQueryParamTracking(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function renderTrackingPage() {
  const orderId = getQueryParamTracking("order");
  const container = document.getElementById("tracking-content");

  if (!orderId) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-magnifying-glass"></i><p>Order ID tidak ditemukan di URL.</p></div>`;
    return;
  }

  const order = getOrderById(orderId);
  if (!order) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-triangle-exclamation"></i><p>Pesanan "${orderId}" tidak ditemukan.</p></div>`;
    return;
  }

  // Aturan bisnis: tracking hanya untuk pembayaran non-COD
  if (order.paymentMethod === "cod") {
    container.innerHTML = `
      <div class="not-shippable-notice">
        <i class="fas fa-circle-info"></i>
        <div>
          Pesanan <strong>${order.id}</strong> menggunakan metode <strong>COD (Bayar di Tempat)</strong>.
          Fitur tracking pengiriman hanya tersedia untuk pesanan dengan pembayaran non-COD
          (QRIS / BRIVA / ShopeePay). Untuk pesanan COD, cukup pantau progres di halaman Pesanan.
        </div>
      </div>`;
    return;
  }

  if (order.paymentStatus === "pending") {
    container.innerHTML = `
      <div class="not-shippable-notice">
        <i class="fas fa-hourglass-half"></i>
        <div>
          Pesanan <strong>${order.id}</strong> masih <strong>menunggu pembayaran</strong> dari pelanggan.
          Tracking pengiriman baru bisa ditampilkan setelah pembayaran dikonfirmasi.
        </div>
      </div>`;
    return;
  }

  if (order.orderStatus === "dibatalkan") {
    container.innerHTML = `
      <div class="not-shippable-notice">
        <i class="fas fa-ban"></i>
        <div>Pesanan <strong>${order.id}</strong> telah dibatalkan.</div>
      </div>`;
    return;
  }

  const currentIndex = TRACKING_FLOW.findIndex((s) => s.status === order.orderStatus);

  const headerHTML = `
    <div class="tracking-header-box">
      <div>
        <div style="font-size:0.8rem; color:#8a6018; margin-bottom:0.3rem;">Order ID</div>
        <div style="font-weight:700; color:var(--primary-brown);">${order.id}</div>
      </div>
      ${
        order.trackingNumber
          ? `<div>
              <div style="font-size:0.8rem; color:#8a6018; margin-bottom:0.3rem;">No. Resi (${order.courier})</div>
              <div class="tracking-number-display">${order.trackingNumber}</div>
            </div>`
          : `<div style="font-size:0.85rem; color:#8a6018;">Nomor resi akan muncul saat status "Dikirim"</div>`
      }
      ${
        order.estimatedDelivery
          ? `<div>
              <div style="font-size:0.8rem; color:#8a6018; margin-bottom:0.3rem;">Estimasi Tiba</div>
              <div style="font-weight:700; color:var(--primary-brown);">${new Date(order.estimatedDelivery).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
            </div>`
          : ""
      }
    </div>`;

  const timelineHTML = TRACKING_FLOW.map((step, idx) => {
    let cls = "";
    if (idx < currentIndex) cls = "done";
    else if (idx === currentIndex) cls = "current";

    const historyEntry = (order.trackingHistory || []).find((h) => h.status === step.status);

    return `
      <li class="${cls}">
        <div class="tracking-step-title"><i class="fas ${step.icon}"></i> ${step.label}</div>
        <div class="tracking-step-time">${
          historyEntry
            ? new Date(historyEntry.timestamp).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
            : idx <= currentIndex
              ? ""
              : "Menunggu"
        }</div>
      </li>`;
  }).join("");

  const nextInfo = (() => {
    if (currentIndex === -1 || currentIndex === TRACKING_FLOW.length - 1) return null;
    const next = TRACKING_FLOW[currentIndex + 1];
    return next;
  })();

  container.innerHTML = `
    ${headerHTML}
    <ul class="tracking-timeline">${timelineHTML}</ul>
    <div style="display:flex; gap:0.8rem; align-items:center; padding-top:0.5rem; border-top:1px solid #f0e6d8;">
      <span style="font-size:0.85rem; color:#8a6d4b;">Alamat: ${order.customer.address}, ${order.customer.city}</span>
    </div>
    ${
      nextInfo
        ? `<button class="btn btn-brown" style="margin-top:1.2rem;" onclick="advanceTrackingStatus('${order.id}', '${nextInfo.status}')">
            <i class="fas fa-forward"></i> Update ke "${nextInfo.label}"
          </button>`
        : `<p style="margin-top:1.2rem; color:var(--success); font-weight:600;"><i class="fas fa-circle-check"></i> Pesanan telah selesai.</p>`
    }
  `;
}

function advanceTrackingStatus(orderId, nextStatus) {
  updateOrderStatus(orderId, nextStatus);
  showNotification(`Status pengiriman diperbarui ke "${TRACKING_FLOW.find((s) => s.status === nextStatus).label}"`, "success");
  renderTrackingPage();
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminLayout("Lacak Pengiriman");
  renderTrackingPage();
});

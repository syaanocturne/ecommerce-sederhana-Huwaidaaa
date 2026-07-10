/**
 * tracking.js
 * Logika halaman tracking.html (konsumen): cari pesanan berdasarkan Order ID
 * + Nomor HP, lalu tampilkan status & riwayat pengiriman.
 *
 * Catatan: data pesanan disimpan di localStorage browser (key "mammalia_orders"),
 * sama seperti yang dipakai checkout.js & Admin Panel. Karena localStorage
 * bersifat per-device/per-browser, pencarian ini hanya bisa menemukan pesanan
 * yang memang dibuat dari browser/device yang sama.
 */

const ORDERS_LS_KEY_TRACKING = "mammalia_orders";

const TRACKING_FLOW = [
  { status: "diproses", label: "Pesanan Diproses", icon: "fa-receipt" },
  { status: "dikemas", label: "Dikemas", icon: "fa-box" },
  { status: "dikirim", label: "Dalam Pengiriman", icon: "fa-truck" },
  { status: "selesai", label: "Diterima", icon: "fa-circle-check" },
];

const ORDER_STATUS_LABELS_TRACKING = {
  menunggu_pembayaran: "Menunggu Pembayaran",
  diproses: "Diproses",
  dikemas: "Dikemas",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

function normalizePhone(phone) {
  // Buang semua karakter selain angka, lalu samakan awalan 62/0
  let digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("62")) digits = "0" + digits.slice(2);
  return digits;
}

function loadOrdersForTracking() {
  try {
    const raw = localStorage.getItem(ORDERS_LS_KEY_TRACKING);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Gagal membaca data pesanan:", e);
    return [];
  }
}

function findOrder(orderId, phone) {
  const orders = loadOrdersForTracking();
  const normalizedInputPhone = normalizePhone(phone);
  return orders.find(
    (o) =>
      o.id.trim().toLowerCase() === orderId.trim().toLowerCase() &&
      normalizePhone(o.customer.phone) === normalizedInputPhone
  );
}

function renderNotFound(container) {
  container.innerHTML = `
    <div class="tracking-search-box tracking-empty-state">
      <i class="fas fa-triangle-exclamation"></i>
      <p><strong>Pesanan tidak ditemukan.</strong></p>
      <p style="font-size: 0.85rem;">Periksa kembali Order ID dan Nomor HP yang kamu gunakan saat checkout, lalu coba lagi.</p>
    </div>`;
}

function renderOrderTracking(order, container) {
  const itemsHTML = order.items
    .map(
      (i) => `
    <div style="display:flex; justify-content:space-between; padding: 0.3rem 0; font-size: 0.85rem;">
      <span>${i.name} &times; ${i.qty}</span>
      <span>${formatRupiah(i.price * i.qty)}</span>
    </div>`
    )
    .join("");

  const headerHTML = `
    <div class="tracking-header-box">
      <div>
        <div style="font-size:0.8rem; color:#8a6018; margin-bottom:0.3rem;">Order ID</div>
        <div style="font-weight:700; color:var(--primary-brown);">${order.id}</div>
      </div>
      <div>
        <div style="font-size:0.8rem; color:#8a6018; margin-bottom:0.3rem;">Tanggal Pesanan</div>
        <div style="font-weight:700; color:var(--primary-brown);">${new Date(order.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
      </div>
      ${
        order.trackingNumber
          ? `<div>
              <div style="font-size:0.8rem; color:#8a6018; margin-bottom:0.3rem;">No. Resi (${order.courier})</div>
              <div class="tracking-number-display">${order.trackingNumber}</div>
            </div>`
          : ""
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

  const itemsBoxHTML = `
    <div style="background: var(--cream); border-radius: 12px; padding: 0.9rem; margin-bottom: 1.2rem;">
      ${itemsHTML}
      <hr style="border:none; border-top:1px dashed rgba(139,69,19,0.2); margin:0.5rem 0;" />
      <div style="display:flex; justify-content:space-between; font-weight:700;"><span>Total</span><span>${formatRupiah(order.total)}</span></div>
    </div>`;

  // Kasus 1: Menunggu konfirmasi pembayaran (ShopeePay yang belum diverifikasi admin)
  if (order.orderStatus === "menunggu_pembayaran") {
    container.innerHTML = `
      <div class="tracking-search-box">
        ${headerHTML}
        <div class="not-shippable-notice">
          <i class="fas fa-hourglass-half"></i>
          <div>
            Pesanan ini masih <strong>menunggu konfirmasi pembayaran</strong>. Kalau kamu sudah
            transfer ShopeePay tapi status belum berubah, pastikan bukti pembayaran & Order ID
            sudah dikirim ke DM Instagram kami ya.
          </div>
        </div>
        ${itemsBoxHTML}
        <a href="https://www.instagram.com/mamamliaa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener" class="btn-primary" style="width:100%; justify-content:center;">
          <i class="fab fa-instagram"></i> Kirim Bukti via DM Instagram
        </a>
      </div>`;
    return;
  }

  // Kasus 2: Dibatalkan
  if (order.orderStatus === "dibatalkan") {
    container.innerHTML = `
      <div class="tracking-search-box">
        ${headerHTML}
        <div class="not-shippable-notice">
          <i class="fas fa-ban"></i>
          <div>Pesanan ini telah <strong>dibatalkan</strong>.</div>
        </div>
        ${itemsBoxHTML}
      </div>`;
    return;
  }

  // Kasus 3: COD - tidak ada tracking pengiriman terpisah
  if (order.paymentMethod === "cod") {
    const currentIndex = TRACKING_FLOW.findIndex((s) => s.status === order.orderStatus);
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

    container.innerHTML = `
      <div class="tracking-search-box">
        ${headerHTML}
        <div class="not-shippable-notice">
          <i class="fas fa-money-bill-wave"></i>
          <div>Pesanan ini <strong>Bayar di Tempat (COD)</strong> — pembayaran dilakukan tunai saat barang tiba.</div>
        </div>
        <ul class="tracking-timeline">${timelineHTML}</ul>
        ${itemsBoxHTML}
      </div>`;
    return;
  }

  // Kasus 4: ShopeePay yang sudah dikonfirmasi -> tampilkan timeline lengkap
  const currentIndex = TRACKING_FLOW.findIndex((s) => s.status === order.orderStatus);
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

  container.innerHTML = `
    <div class="tracking-search-box">
      ${headerHTML}
      <ul class="tracking-timeline">${timelineHTML}</ul>
      ${itemsBoxHTML}
    </div>`;
}

function handleTrackingSearch(e) {
  e.preventDefault();
  const orderIdInput = document.getElementById("track-order-id");
  const phoneInput = document.getElementById("track-phone");
  const orderId = orderIdInput.value.trim();
  const phone = phoneInput.value.trim();
  const container = document.getElementById("tracking-result");

  if (!orderId || !phone) {
    showNotification("Mohon isi Order ID dan Nomor HP.", "error");
    return;
  }

  trackEvent("track_order", { order_id: orderId });

  const order = findOrder(orderId, phone);
  if (!order) {
    renderNotFound(container);
    return;
  }
  renderOrderTracking(order, container);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("tracking-search-form")?.addEventListener("submit", handleTrackingSearch);

  // Prefill Order ID kalau datang dari link (?order=MAM-xxxx)
  const prefillId = new URLSearchParams(window.location.search).get("order");
  if (prefillId) {
    document.getElementById("track-order-id").value = prefillId;
  }
});

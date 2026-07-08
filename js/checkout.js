/**
 * checkout.js
 * Logika halaman checkout.html: menampilkan ringkasan order,
 * validasi form sederhana, dan simulasi payment gateway (dummy Midtrans/Xendit).
 */
 
const CHECKOUT_SHIPPING_FEE = 10000;
const ORDERS_LS_KEY = "mammalia_orders";
const PRODUCTS_LS_KEY_CHECKOUT = "mammalia_products";
let selectedPayment = "midtrans";
 
function renderOrderSummary() {
  const cart = getCart();
  const list = document.getElementById("order-items-list");
  const subtotalEl = document.getElementById("order-subtotal");
  const shippingEl = document.getElementById("order-shipping");
  const totalEl = document.getElementById("order-total");
 
  if (cart.length === 0) {
    // Tidak ada item, arahkan kembali ke halaman cart
    window.location.href = "cart.html";
    return;
  }
 
  list.innerHTML = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return "";
      return `
      <div class="order-item-row">
        <span>${product.name} &times; ${item.qty}</span>
        <span>${formatRupiah(product.price * item.qty)}</span>
      </div>`;
    })
    .join("");
 
  const subtotal = getCartTotal();
  const shipping = CHECKOUT_SHIPPING_FEE;
  const total = subtotal + shipping;
 
  subtotalEl.textContent = formatRupiah(subtotal);
  shippingEl.textContent = formatRupiah(shipping);
  totalEl.textContent = formatRupiah(total);
}
 
/* ---------------------------------------------------------------------- *
 * VALIDASI FORM SEDERHANA
 * ---------------------------------------------------------------------- */
 
function validateField(id, validatorFn, errorMessage) {
  const field = document.getElementById(id);
  const group = field.closest(".form-group");
  const errorEl = group.querySelector(".error-msg");
  const isValid = validatorFn(field.value.trim());
 
  if (!isValid) {
    group.classList.add("invalid");
    if (errorEl) errorEl.textContent = errorMessage;
  } else {
    group.classList.remove("invalid");
  }
  return isValid;
}
 
function validateCheckoutForm() {
  let valid = true;
 
  valid =
    validateField("full-name", (v) => v.length >= 3, "Nama minimal 3 karakter.") && valid;
 
  valid =
    validateField(
      "email",
      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      "Format email tidak valid."
    ) && valid;
 
  valid =
    validateField(
      "phone",
      (v) => /^[0-9+ ]{9,15}$/.test(v),
      "Nomor HP tidak valid (9-15 digit)."
    ) && valid;
 
  valid =
    validateField("address", (v) => v.length >= 10, "Alamat minimal 10 karakter.") && valid;
 
  valid = validateField("city", (v) => v.length >= 2, "Kota wajib diisi.") && valid;
 
  valid =
    validateField(
      "postal-code",
      (v) => /^[0-9]{5}$/.test(v),
      "Kode pos harus 5 digit angka."
    ) && valid;
 
  return valid;
}
 
/* ---------------------------------------------------------------------- *
 * PEMILIHAN METODE PEMBAYARAN
 * ---------------------------------------------------------------------- */
 
function selectPaymentMethod(method) {
  selectedPayment = method;
  document.querySelectorAll(".payment-option").forEach((el) => {
    el.classList.toggle("selected", el.dataset.method === method);
  });
}
 
/* ---------------------------------------------------------------------- *
 * SIMPAN PESANAN & UPDATE STOK (supaya nyambung ke Admin Panel)
 * ---------------------------------------------------------------------- */
 
function buildOrderObject(orderId, cartSnapshot, total) {
  const items = cartSnapshot.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return {
      id: item.id,
      name: product ? product.name : "Produk",
      qty: item.qty,
      price: product ? product.price : 0,
    };
  });
 
  const nowIso = new Date().toISOString();
 
  return {
    id: orderId,
    customer: {
      name: document.getElementById("full-name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      postalCode: document.getElementById("postal-code").value.trim(),
    },
    items,
    shipping: CHECKOUT_SHIPPING_FEE,
    total,
    paymentMethod: selectedPayment, // "midtrans" | "xendit" | "cod"
    // Midtrans & Xendit: simulasi selalu sukses -> anggap sudah lunas.
    // COD: baru lunas saat barang diterima, jadi statusnya pending dulu.
    paymentStatus: selectedPayment === "cod" ? "pending" : "paid",
    orderStatus: "diproses",
    date: nowIso,
    trackingHistory: [{ status: "diproses", timestamp: nowIso }],
  };
}
 
function saveOrderToStorage(order) {
  try {
    const raw = localStorage.getItem(ORDERS_LS_KEY);
    const orders = raw ? JSON.parse(raw) : [];
    orders.push(order);
    localStorage.setItem(ORDERS_LS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error("Gagal menyimpan pesanan:", e);
  }
}
 
function decrementStockAndSave(cartSnapshot) {
  try {
    const raw = localStorage.getItem(PRODUCTS_LS_KEY_CHECKOUT);
    const products = raw ? JSON.parse(raw) : PRODUCTS;
    cartSnapshot.forEach((item) => {
      const p = products.find((pr) => pr.id === item.id);
      if (p) p.stock = Math.max(0, p.stock - item.qty);
    });
    localStorage.setItem(PRODUCTS_LS_KEY_CHECKOUT, JSON.stringify(products));
  } catch (e) {
    console.error("Gagal memperbarui stok produk:", e);
  }
}
 
/* ---------------------------------------------------------------------- *
 * SIMULASI PAYMENT GATEWAY
 * Catatan: Ini adalah simulasi untuk keperluan demo/tugas.
 * Di implementasi nyata, langkah ini akan memanggil API
 * Midtrans Snap / Xendit Invoice untuk membuat transaksi sungguhan,
 * lalu menunggu callback/webhook status pembayaran dari server.
 * ---------------------------------------------------------------------- */
 
function simulatePayment() {
  const submitBtn = document.getElementById("submit-order-btn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses pembayaran...';
 
  const cartSnapshot = getCart(); // ambil sebelum keranjang dikosongkan
  const total = getCartTotal() + CHECKOUT_SHIPPING_FEE;
  const orderId = "MAM-" + Date.now().toString().slice(-8);
 
  trackEvent("begin_checkout", { value: total, payment_method: selectedPayment });
 
  setTimeout(() => {
    trackEvent("purchase", {
      transaction_id: orderId,
      value: total,
      payment_method: selectedPayment,
    });
 
    // Simpan pesanan & update stok supaya langsung terlihat di Admin Panel
    const order = buildOrderObject(orderId, cartSnapshot, total);
    saveOrderToStorage(order);
    decrementStockAndSave(cartSnapshot);
 
    document.getElementById("checkout-form-section").style.display = "none";
    document.getElementById("order-summary-section").style.display = "none";
    const result = document.getElementById("payment-result");
    result.style.display = "block";
    document.getElementById("result-order-id").textContent = orderId;
    document.getElementById("result-total").textContent = formatRupiah(total);
    document.getElementById("result-method").textContent = paymentMethodLabel(selectedPayment);
 
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 1800);
}
 
function paymentMethodLabel(method) {
  const labels = {
    midtrans: "Midtrans (Simulasi)",
    xendit: "Xendit (Simulasi)",
    cod: "Bayar di Tempat (COD)",
  };
  return labels[method] || method;
}
 
/* ---------------------------------------------------------------------- *
 * INIT
 * ---------------------------------------------------------------------- */
 
document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary();
 
  document.querySelectorAll(".payment-option").forEach((el) => {
    el.addEventListener("click", () => selectPaymentMethod(el.dataset.method));
  });
 
  document.getElementById("checkout-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateCheckoutForm()) {
      simulatePayment();
    } else {
      showNotification("Mohon lengkapi form dengan benar.", "error");
    }
});
});
 

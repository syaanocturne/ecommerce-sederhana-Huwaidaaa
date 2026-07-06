/**
 * checkout.js
 * Logika halaman checkout.html: menampilkan ringkasan order,
 * validasi form sederhana, dan simulasi payment gateway (dummy Midtrans/Xendit).
 */

const CHECKOUT_SHIPPING_FEE = 15000;
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

  const total = getCartTotal() + CHECKOUT_SHIPPING_FEE;
  const orderId = "MAM-" + Date.now().toString().slice(-8);

  trackEvent("begin_checkout", { value: total, payment_method: selectedPayment });

  setTimeout(() => {
    trackEvent("purchase", {
      transaction_id: orderId,
      value: total,
      payment_method: selectedPayment,
    });

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

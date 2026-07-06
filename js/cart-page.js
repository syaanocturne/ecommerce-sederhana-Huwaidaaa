/**
 * cart-page.js
 * Logika khusus halaman cart.html: render daftar item, update qty,
 * hapus item, hitung subtotal/total otomatis, dan kode promo (simulasi).
 */

const SHIPPING_FEE = 15000;
let appliedDiscount = 0; // persentase, contoh: 10 = 10%

function renderCartPage() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  const emptyState = document.getElementById("empty-cart");
  const layout = document.getElementById("cart-layout");

  if (cart.length === 0) {
    if (layout) layout.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (layout) layout.style.display = "grid";
  if (emptyState) emptyState.style.display = "none";

  container.innerHTML = cart
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return "";
      const subtotal = product.price * item.qty;
      return `
      <div class="cart-item" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" />
        <div>
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-meta">${product.weight} &middot; ${categoryLabelSafe(product.category)}</div>
          <div class="cart-item-price">${formatRupiah(product.price)}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeCartQty(${product.id}, -1)" aria-label="Kurangi">-</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="changeCartQty(${product.id}, 1)" aria-label="Tambah">+</button>
          </div>
        </div>
        <div class="cart-item-actions">
          <div class="item-subtotal">${formatRupiah(subtotal)}</div>
          <button class="remove-btn" onclick="handleRemove(${product.id})">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </div>
      </div>`;
    })
    .join("");

  renderSummary();
}

function categoryLabelSafe(value) {
  const found = CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
}

function changeCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  const product = PRODUCTS.find((p) => p.id === id);
  const newQty = item.qty + delta;

  if (newQty > product.stock) {
    showNotification(`Stok ${product.name} tersisa ${product.stock} pcs`, "error");
    return;
  }
  updateCartQty(id, newQty);
  renderCartPage();
}

function handleRemove(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  removeFromCart(id);
  renderCartPage();
  if (product) showNotification(`${product.name} dihapus dari keranjang`, "error");
}

function renderSummary() {
  const subtotal = getCartTotal();
  const cart = getCart();
  const shipping = cart.length > 0 ? SHIPPING_FEE : 0;
  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const total = subtotal + shipping - discountAmount;

  document.getElementById("summary-subtotal").textContent = formatRupiah(subtotal);
  document.getElementById("summary-shipping").textContent = formatRupiah(shipping);

  const discountRow = document.getElementById("summary-discount-row");
  if (appliedDiscount > 0) {
    discountRow.style.display = "flex";
    document.getElementById("summary-discount").textContent = "-" + formatRupiah(discountAmount);
  } else {
    discountRow.style.display = "none";
  }

  document.getElementById("summary-total").textContent = formatRupiah(Math.max(total, 0));

  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.classList.toggle("disabled-link", cart.length === 0);
  }
}

function applyPromoCode() {
  const input = document.getElementById("promo-input");
  const msg = document.getElementById("promo-msg");
  const code = input.value.trim().toUpperCase();

  const validCodes = {
    MAMMALIA10: 10,
    SWEET20: 20,
  };

  if (validCodes[code]) {
    appliedDiscount = validCodes[code];
    msg.textContent = `Kode promo berhasil! Diskon ${appliedDiscount}% diterapkan.`;
    msg.className = "promo-msg success";
    trackEvent("promo_applied", { code, discount: appliedDiscount });
  } else {
    appliedDiscount = 0;
    msg.textContent = "Kode promo tidak valid.";
    msg.className = "promo-msg error";
  }
  renderSummary();
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();

  const checkoutBtn = document.getElementById("checkout-btn");
  checkoutBtn?.addEventListener("click", (e) => {
    if (getCart().length === 0) {
      e.preventDefault();
      showNotification("Keranjang kosong. Tambahkan produk terlebih dahulu.", "error");
    }
  });

  document.getElementById("promo-apply-btn")?.addEventListener("click", applyPromoCode);
});

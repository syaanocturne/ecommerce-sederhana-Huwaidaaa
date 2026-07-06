/**
 * main.js
 * Fungsi bersama yang dipakai di semua halaman:
 * - Manajemen keranjang belanja via localStorage
 * - Navbar mobile (hamburger)
 * - Notifikasi toast
 * - Smooth scrolling
 * - Wrapper Google Analytics (dummy) untuk tracking event penting
 */

const CART_KEY = "mammalia_cart";

/* ---------------------------------------------------------------------- *
 * CART STORAGE (localStorage)
 * Struktur data: [{ id: <number produk>, qty: <number> }, ...]
 * ---------------------------------------------------------------------- */

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Gagal membaca keranjang:", e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  } catch (e) {
    console.error("Gagal menyimpan keranjang:", e);
  }
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }
  saveCart(cart);

  const product = typeof PRODUCTS !== "undefined" ? PRODUCTS.find((p) => p.id === productId) : null;
  trackEvent("add_to_cart", {
    item_id: productId,
    item_name: product ? product.name : "unknown",
    quantity: qty,
  });

  if (product) {
    showNotification(`${product.name} ditambahkan ke keranjang!`, "success");
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  trackEvent("remove_from_cart", { item_id: productId });
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }
  item.qty = qty;
  saveCart(cart);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  const cart = getCart();
  if (typeof PRODUCTS === "undefined") return 0;
  return cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function updateCartBadge() {
  document.querySelectorAll(".cart-count").forEach((el) => el.remove());
  const count = getCartCount();
  if (count <= 0) return;
  document.querySelectorAll(".cart-link").forEach((link) => {
    const badge = document.createElement("span");
    badge.className = "cart-count";
    badge.textContent = count;
    link.appendChild(badge);
  });
}

/* ---------------------------------------------------------------------- *
 * NAVBAR MOBILE
 * ---------------------------------------------------------------------- */

function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  document.querySelectorAll("#nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (!header) return;
    header.style.boxShadow =
      window.scrollY > 100
        ? "0 5px 30px rgba(139, 69, 19, 0.2)"
        : "0 2px 20px rgba(139, 69, 19, 0.15)";
  });
}

/* ---------------------------------------------------------------------- *
 * NOTIFICATION TOAST
 * ---------------------------------------------------------------------- */

function showNotification(message, type = "success") {
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = `notification show ${type === "error" ? "error" : ""}`;
  const icon = type === "error" ? "fa-circle-exclamation" : "fa-check-circle";
  notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* ---------------------------------------------------------------------- *
 * SMOOTH SCROLLING untuk anchor link (#section) di halaman yang sama
 * ---------------------------------------------------------------------- */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

/* ---------------------------------------------------------------------- *
 * GOOGLE ANALYTICS (DUMMY)
 * Catatan: ID pengukuran di bawah adalah dummy untuk keperluan demo/tugas.
 * Di produksi, ganti "G-XXXXXXXXXX" dengan Measurement ID asli dari GA4,
 * lalu event-event di trackEvent() akan otomatis tercatat di dashboard GA.
 *
 * Metrik yang direncanakan untuk dipantau:
 * 1. Bounce rate           - halaman mana yang cepat ditinggalkan pengunjung
 * 2. Conversion rate       - persentase visitor yang menyelesaikan checkout
 * 3. Add-to-cart rate      - rasio klik "Add to Cart" dibanding jumlah visitor produk
 * 4. Cart abandonment rate - berapa banyak yang menambah ke cart tapi tidak checkout
 * 5. Average order value   - rata-rata nilai transaksi
 * 6. Top produk terlaris   - produk dengan event add_to_cart & purchase terbanyak
 * 7. Traffic source        - dari mana pengunjung datang (organik, sosial media, dsb)
 * 8. Search terms          - kata kunci yang paling sering dicari di search box
 * ---------------------------------------------------------------------- */

// Catatan: snippet gtag.js resmi (dengan Measurement ID dummy G-XXXXXXXXXX)
// dipasang langsung di <head> setiap halaman HTML. Fungsi di bawah ini
// hanya membungkus pemanggilan gtag() supaya event tracking konsisten
// dan tetap aman dipanggil walau script GA gagal/tidak dimuat (mis. offline).
function trackEvent(eventName, params = {}) {
  if (typeof gtag === "function") {
    gtag("event", eventName, params);
  }
  // Dev log agar bisa dilihat aktivitas tracking selama demo/testing
  console.log(`[Analytics] ${eventName}`, params);
}

/* ---------------------------------------------------------------------- *
 * INIT saat DOM siap
 * ---------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initSmoothScroll();
  updateCartBadge();
  trackEvent("page_view", { page_path: window.location.pathname });
});

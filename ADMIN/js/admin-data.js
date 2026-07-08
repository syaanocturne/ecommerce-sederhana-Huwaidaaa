/**
 * admin-data.js
 * "Backend palsu" untuk admin panel Mammalia — semua data (produk & pesanan)
 * disimpan di localStorage browser supaya panel ini bisa berjalan sendiri
 * tanpa server. Data awal (seed) otomatis dibuat saat pertama kali dibuka.
 */

const CATEGORIES = [
  { value: "cookies", label: "Cookies" },
  { value: "pastry", label: "Pastry" },
  { value: "giftbox", label: "Gift Box / Hampers" },
];

const ORDER_STATUS_LABELS = {
  menunggu_pembayaran: "Menunggu Pembayaran",
  diproses: "Diproses",
  dikemas: "Dikemas",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

// PENTING: key ini HARUS PERSIS SAMA dengan yang dipakai di js/products.js
// dan js/checkout.js pada toko utama, supaya data produk & pesanan nyambung.
const LS_PRODUCTS_KEY = "mammalia_products";
const LS_ORDERS_KEY = "mammalia_orders";

/* ------------------------------------------------------------------ *
 * SEED DATA (hanya dipakai kalau localStorage benar-benar masih kosong,
 * misalnya belum pernah ada yang buka toko utama sama sekali).
 * Katalog di bawah ini disamakan persis dengan js/products.js toko utama.
 * ------------------------------------------------------------------ */
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Chocolate Bites", category: "cookies", weight: "300gr", price: 35000, image: "images/chocolate-bites.jpeg", description: "Cookies cokelat lumer dengan potongan dark chocolate premium di setiap gigitan. Renyah di luar, lembut di dalam — favorit sepanjang masa.", stock: 24, badge: "Best Seller", rating: 4.9 },
  { id: 2, name: "Matcha Bites", category: "cookies", weight: "300gr", price: 35000, image: "images/matcha-bites.jpeg", description: "Perpaduan matcha Jepang asli dengan white chocolate chips. Rasa earthy yang seimbang dengan manis lembut, cocok untuk pecinta green tea.", stock: 18, badge: "New", rating: 4.8 },
  { id: 3, name: "Red Velvet Cookies", category: "cookies", weight: "300gr", price: 35000, image: "images/red-velvet-cookies.jpeg", description: "Cookies merah khas red velvet dengan cream cheese chips di dalamnya. Tampilan cantik, rasa creamy yang memanjakan lidah.", stock: 20, badge: "", rating: 4.7 },
  { id: 4, name: "Kastangel", category: "pastry", weight: "250gr", price: 40000, image: "images/kastangel.jpeg", description: "Kastangel klasik dengan keju edam pilihan, gurih dan renyah. Dibuat dengan resep rumahan turun-temurun.", stock: 15, badge: "Best Seller", rating: 4.9 },
  { id: 5, name: "Nastar Premium", category: "pastry", weight: "250gr", price: 42000, image: "images/nastar.svg", description: "Nastar dengan selai nanas asli tanpa pengawet, tekstur lumer di mulut dengan taburan keju parut di atasnya.", stock: 22, badge: "", rating: 4.8 },
  { id: 6, name: "Choco Chip Cookies", category: "cookies", weight: "300gr", price: 33000, image: "images/choco-chip.svg", description: "Cookies klasik dengan choco chip melimpah. Tekstur chewy di tengah dan crispy di pinggir, cocok menemani waktu santai.", stock: 30, badge: "", rating: 4.6 },
  { id: 7, name: "Oatmeal Raisin Cookies", category: "cookies", weight: "300gr", price: 32000, image: "images/oatmeal-raisin.svg", description: "Cookies oatmeal sehat dengan kismis manis alami. Pilihan tepat untuk camilan yang lebih ringan tanpa mengurangi kelezatan.", stock: 16, badge: "Sehat", rating: 4.5 },
  { id: 8, name: "Almond Crunch Cookies", category: "cookies", weight: "250gr", price: 45000, image: "images/almond-crunch.svg", description: "Cookies premium dengan taburan almond panggang utuh. Renyah maksimal dengan aroma kacang yang khas.", stock: 12, badge: "Premium", rating: 4.9 },
  { id: 9, name: "Lebaran Gift Box (Mix 4 Toples)", category: "giftbox", weight: "4 x 250gr", price: 150000, image: "images/gift-box-lebaran.svg", description: "Paket hampers berisi 4 toples cookies pilihan, dikemas eksklusif dengan kotak elegan. Pilihan tepat untuk hadiah Lebaran & hari raya.", stock: 10, badge: "Hampers", rating: 5.0 },
  { id: 10, name: "Cookies Sampler Pack (5 Varian)", category: "giftbox", weight: "5 x 150gr", price: 120000, image: "images/sampler-pack.svg", description: "Cicipi 5 varian rasa terbaik kami dalam satu paket: chocolate, matcha, red velvet, choco chip, dan almond crunch.", stock: 14, badge: "Hampers", rating: 4.9 },
];

// Kosong secara default — pesanan asli akan otomatis masuk ke sini
// begitu ada pelanggan checkout di toko utama (lihat js/checkout.js).
const DEFAULT_ORDERS = [];

/* ------------------------------------------------------------------ *
 * LOAD / SAVE
 * ------------------------------------------------------------------ */
function loadProducts() {
  const raw = localStorage.getItem(LS_PRODUCTS_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through to seed */ }
  }
  localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}

function loadOrders() {
  const raw = localStorage.getItem(LS_ORDERS_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) { /* fall through to seed */ }
  }
  localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(DEFAULT_ORDERS));
  return JSON.parse(JSON.stringify(DEFAULT_ORDERS));
}

let PRODUCTS = loadProducts();
let ORDERS = loadOrders();

function saveProducts() {
  localStorage.setItem(LS_PRODUCTS_KEY, JSON.stringify(PRODUCTS));
}

function saveOrders() {
  localStorage.setItem(LS_ORDERS_KEY, JSON.stringify(ORDERS));
}

/* ------------------------------------------------------------------ *
 * HELPERS
 * ------------------------------------------------------------------ */
function formatRupiah(amount) {
  return "Rp" + Number(amount || 0).toLocaleString("id-ID");
}

function showNotification(message, type = "success") {
  let wrap = document.getElementById("admin-toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "admin-toast-wrap";
    document.body.appendChild(wrap);
  }
  const icon = type === "error" ? "fa-circle-exclamation" : "fa-circle-check";
  const toast = document.createElement("div");
  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

/* ------------------------------------------------------------------ *
 * PRODUCTS CRUD
 * ------------------------------------------------------------------ */
function addProduct(data) {
  const newId = PRODUCTS.length ? Math.max(...PRODUCTS.map((p) => p.id)) + 1 : 1;
  PRODUCTS.push({ id: newId, ...data });
  saveProducts();
}

function updateProduct(id, data) {
  const idx = PRODUCTS.findIndex((p) => p.id === id);
  if (idx === -1) return;
  PRODUCTS[idx] = { ...PRODUCTS[idx], ...data };
  saveProducts();
}

function deleteProduct(id) {
  PRODUCTS = PRODUCTS.filter((p) => p.id !== id);
  saveProducts();
}

/* ------------------------------------------------------------------ *
 * ORDERS
 * ------------------------------------------------------------------ */
function getOrders() {
  return [...ORDERS].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getOrderById(id) {
  return ORDERS.find((o) => o.id === id);
}

function getOrderStats() {
  const totalOrders = ORDERS.length;
  const pendingPayment = ORDERS.filter((o) => o.orderStatus === "menunggu_pembayaran").length;
  const processing = ORDERS.filter((o) => ["diproses", "dikemas", "dikirim"].includes(o.orderStatus)).length;
  const totalRevenue = ORDERS.filter(
    (o) => o.orderStatus !== "dibatalkan" && (o.paymentStatus === "paid" || o.paymentMethod === "cod")
  ).reduce((sum, o) => sum + o.total, 0);
  return { totalOrders, pendingPayment, processing, totalRevenue };
}

function updateOrderStatus(orderId, newStatus) {
  const order = ORDERS.find((o) => o.id === orderId);
  if (!order) return;
  order.orderStatus = newStatus;
  order.trackingHistory = order.trackingHistory || [];
  order.trackingHistory.push({ status: newStatus, timestamp: new Date().toISOString() });

  if (newStatus === "dikirim" && !order.trackingNumber && order.paymentMethod !== "cod") {
    const couriers = ["JNE", "SiCepat", "AnterAja", "J&T"];
    order.courier = couriers[Math.floor(Math.random() * couriers.length)];
    order.trackingNumber = order.courier.replace(/[^A-Z]/g, "").slice(0, 3).toUpperCase() + Math.floor(10000000 + Math.random() * 89999999);
    const est = new Date();
    est.setDate(est.getDate() + 3);
    order.estimatedDelivery = est.toISOString();
  }
  saveOrders();
}

function markOrderPaid(orderId) {
  const order = ORDERS.find((o) => o.id === orderId);
  if (!order) return;
  order.paymentStatus = "paid";
  order.orderStatus = "diproses";
  order.trackingHistory = order.trackingHistory || [];
  order.trackingHistory.push({ status: "diproses", timestamp: new Date().toISOString() });
  saveOrders();
}

/**
 * admin-layout.js
 * Merender sidebar & topbar admin secara dinamis supaya tidak perlu
 * menduplikasi markup yang sama di setiap halaman admin.
 * Setiap halaman cukup punya <body data-page="dashboard"> (atau produk/pesanan/dll)
 * dan dua placeholder: #sidebar-placeholder & #topbar-placeholder.
 */

const ADMIN_NAV_ITEMS = [
  { page: "dashboard", href: "dashboard.html", icon: "fa-gauge-high", label: "Dashboard" },
  { page: "products", href: "products.html", icon: "fa-cookie-bite", label: "Produk" },
  { page: "product-form", href: "product-form.html", icon: "fa-plus", label: "Tambah Produk", hiddenInNav: true },
  { page: "orders", href: "orders.html", icon: "fa-receipt", label: "Pesanan" },
  { page: "tracking", href: "tracking.html", icon: "fa-truck-fast", label: "Tracking", hiddenInNav: true },
];

const PAGE_TITLES = {
  dashboard: "Dashboard",
  products: "Manajemen Produk",
  "product-form": "Form Produk",
  orders: "Manajemen Pesanan",
  tracking: "Lacak Pengiriman",
};

function renderAdminSidebar() {
  const placeholder = document.getElementById("sidebar-placeholder");
  if (!placeholder) return;

  const currentPage = document.body.dataset.page;
  const adminName = sessionStorage.getItem("mammalia_admin_name") || "Admin";

  const navHTML = ADMIN_NAV_ITEMS.filter((item) => !item.hiddenInNav)
    .map(
      (item) => `
      <li>
        <a href="${item.href}" class="${item.page === currentPage ? "active" : ""}">
          <i class="fas ${item.icon}"></i> ${item.label}
        </a>
      </li>`
    )
    .join("");

  placeholder.innerHTML = `
    <aside class="admin-sidebar" id="admin-sidebar">
      <a href="dashboard.html" class="admin-logo">
        <i class="fas fa-cookie-bite"></i> Mammalia Admin
      </a>
      <ul class="admin-nav">
        ${navHTML}
      </ul>
      <hr class="admin-nav-divider" />
      <ul class="admin-nav">
        <li><a href="../index.html"><i class="fas fa-arrow-left"></i> Kembali ke Toko</a></li>
        <li><a href="#" onclick="adminLogout(); return false;"><i class="fas fa-right-from-bracket"></i> Logout</a></li>
      </ul>
      <div class="admin-sidebar-footer" style="padding: 0.8rem 0.6rem; font-size: 0.75rem; color: rgba(255,255,255,0.6);">
        Masuk sebagai <strong>${adminName}</strong>
      </div>
    </aside>`;
}

function renderAdminTopbar(customTitle) {
  const placeholder = document.getElementById("topbar-placeholder");
  if (!placeholder) return;

  const currentPage = document.body.dataset.page;
  const title = customTitle || PAGE_TITLES[currentPage] || "Admin";

  placeholder.innerHTML = `
    <div class="admin-topbar">
      <div style="display:flex; align-items:center; gap:1rem;">
        <button class="admin-hamburger" id="admin-hamburger"><i class="fas fa-bars"></i></button>
        <h1>${title}</h1>
      </div>
      <div class="admin-topbar-user">
        <i class="fas fa-circle-user" style="font-size:1.4rem; color: var(--primary-brown);"></i>
        ${sessionStorage.getItem("mammalia_admin_name") || "Admin"}
      </div>
    </div>`;

  document.getElementById("admin-hamburger")?.addEventListener("click", () => {
    document.getElementById("admin-sidebar")?.classList.toggle("open");
  });
}

function initAdminLayout(customTitle) {
  requireAdminAuth();
  document.body.classList.add("admin-body");
  renderAdminSidebar();
  renderAdminTopbar(customTitle);
}

/**
 * admin-products.js
 * Logika halaman products.html: render tabel produk, pencarian, dan hapus
 * produk (dengan modal konfirmasi).
 */

let productIdToDelete = null;

function categoryLabelAdmin(value) {
  const found = CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
}

function renderProductsTable() {
  const searchTerm = (document.getElementById("admin-search")?.value || "").toLowerCase().trim();
  const tbody = document.getElementById("products-table-body");
  const countEl = document.getElementById("product-count");

  const filtered = PRODUCTS.filter((p) => p.name.toLowerCase().includes(searchTerm));
  countEl.textContent = PRODUCTS.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-box-open"></i><p>Produk tidak ditemukan.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (p) => `
    <tr>
      <td style="display:flex; align-items:center; gap:0.8rem;">
        <img src="../${p.image}" class="thumb" alt="${p.name}" onerror="this.style.visibility='hidden'" />
        <div>
          <div style="font-weight:600;">${p.name}</div>
          <div style="font-size:0.78rem; color:#a3876a;">${p.weight}</div>
        </div>
      </td>
      <td>${categoryLabelAdmin(p.category)}</td>
      <td>${formatRupiah(p.price)}</td>
      <td><span class="pill ${p.stock <= 12 ? "pill-red" : "pill-green"}">${p.stock} pcs</span></td>
      <td>${p.badge ? `<span class="pill pill-yellow">${p.badge}</span>` : "-"}</td>
      <td>
        <a href="product-form.html?id=${p.id}" class="icon-btn" title="Edit"><i class="fas fa-pen"></i></a>
        <button class="icon-btn danger" title="Hapus" onclick="openDeleteModal(${p.id}, '${p.name.replace(/'/g, "\\'")}')">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>`
    )
    .join("");
}

function openDeleteModal(id, name) {
  productIdToDelete = id;
  document.getElementById("delete-modal-text").textContent =
    `"${name}" akan dihapus permanen dari katalog. Tindakan ini tidak bisa dibatalkan.`;
  document.getElementById("delete-modal").classList.add("show");
}

function closeDeleteModal() {
  productIdToDelete = null;
  document.getElementById("delete-modal").classList.remove("show");
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminLayout();
  renderProductsTable();

  document.getElementById("admin-search")?.addEventListener("input", renderProductsTable);

  document.getElementById("cancel-delete-btn")?.addEventListener("click", closeDeleteModal);
  document.getElementById("confirm-delete-btn")?.addEventListener("click", () => {
    if (productIdToDelete !== null) {
      deleteProduct(productIdToDelete);
      showNotification("Produk berhasil dihapus.", "success");
      closeDeleteModal();
      renderProductsTable();
    }
  });
});

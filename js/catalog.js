/**
 * catalog.js
 * Menampilkan katalog produk di index.html, menangani filter kategori,
 * pencarian nama produk, sortir harga, dan modal detail produk.
 */

let currentModalProduct = null;
let currentModalQty = 1;

function renderCategoryOptions() {
  const select = document.getElementById("category-filter");
  if (!select) return;
  select.innerHTML = CATEGORIES.map(
    (c) => `<option value="${c.value}">${c.label}</option>`
  ).join("");
}

function getFilteredProducts() {
  const searchTerm = (document.getElementById("search-input")?.value || "")
    .toLowerCase()
    .trim();
  const category = document.getElementById("category-filter")?.value || "all";
  const sortBy = document.getElementById("sort-filter")?.value || "default";

  let result = PRODUCTS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm);
    const matchesCategory = category === "all" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  if (sortBy === "price-asc") {
    result = result.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    result = result.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name-asc") {
    result = result.sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  const resultsCount = document.getElementById("results-count");
  if (!grid) return;

  const filtered = getFilteredProducts();

  if (resultsCount) {
    resultsCount.textContent = `Menampilkan ${filtered.length} dari ${PRODUCTS.length} produk`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-cookie" style="font-size:2.5rem;color:var(--dark-cream);margin-bottom:1rem;"></i>
        <p>Produk tidak ditemukan. Coba kata kunci atau filter lain.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (p) => `
    <article class="product-card" data-id="${p.id}" onclick="openProductModal(${p.id})">
      <div class="product-image-wrap">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy" />
      </div>
      <div class="product-info">
        <div class="product-category-tag">${categoryLabel(p.category)}</div>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-weight">${p.weight}</div>
        <div class="product-price">${formatRupiah(p.price)}</div>
        <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${p.id}, 1)">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </article>`
    )
    .join("");
}

function categoryLabel(value) {
  const found = CATEGORIES.find((c) => c.value === value);
  return found ? found.label : value;
}

/* ---------------------------------------------------------------------- *
 * MODAL DETAIL PRODUK
 * ---------------------------------------------------------------------- */

function openProductModal(id) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  currentModalProduct = product;
  currentModalQty = 1;

  document.getElementById("modal-image").src = product.image;
  document.getElementById("modal-image").alt = product.name;
  document.getElementById("modal-category").textContent = categoryLabel(product.category);
  document.getElementById("modal-name").textContent = product.name;
  document.getElementById("modal-rating").innerHTML =
    `<i class="fas fa-star"></i> ${product.rating} &middot; Stok: ${product.stock} pcs`;
  document.getElementById("modal-price").textContent = formatRupiah(product.price);
  document.getElementById("modal-desc").textContent = product.description;
  document.getElementById("modal-qty").textContent = currentModalQty;

  document.getElementById("product-modal").classList.add("show");
  document.body.style.overflow = "hidden";

  trackEvent("view_item", { item_id: product.id, item_name: product.name });
}

function closeProductModal() {
  document.getElementById("product-modal").classList.remove("show");
  document.body.style.overflow = "";
  currentModalProduct = null;
}

function changeModalQty(delta) {
  if (!currentModalProduct) return;
  currentModalQty = Math.max(1, Math.min(currentModalProduct.stock, currentModalQty + delta));
  document.getElementById("modal-qty").textContent = currentModalQty;
}

function addModalToCart() {
  if (!currentModalProduct) return;
  addToCart(currentModalProduct.id, currentModalQty);
  closeProductModal();
}

/* ---------------------------------------------------------------------- *
 * INIT
 * ---------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  renderCategoryOptions();
  renderProducts();

  document.getElementById("search-input")?.addEventListener("input", () => {
    renderProducts();
    trackEvent("search", { search_term: document.getElementById("search-input").value });
  });
  document.getElementById("category-filter")?.addEventListener("change", renderProducts);
  document.getElementById("sort-filter")?.addEventListener("change", renderProducts);

  document.getElementById("modal-overlay-bg")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay-bg" || e.target.id === "product-modal") {
      closeProductModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProductModal();
  });
});

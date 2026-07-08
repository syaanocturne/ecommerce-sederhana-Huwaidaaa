/**
 * admin-product-form.js
 * Menangani mode Tambah & Edit produk dalam satu halaman (product-form.html).
 * Mode ditentukan dari query parameter ?id=<productId> di URL.
 */

let editingProductId = null;

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function fillFormWithProduct(product) {
  document.getElementById("p-image").value = product.image;
  document.getElementById("p-name").value = product.name;
  document.getElementById("p-category").value = product.category;
  document.getElementById("p-weight").value = product.weight;
  document.getElementById("p-price").value = product.price;
  document.getElementById("p-stock").value = product.stock;
  document.getElementById("p-badge").value = product.badge || "";
  document.getElementById("p-rating").value = product.rating || 4.5;
  document.getElementById("p-desc").value = product.description;
  updateImagePreview(product.image);
}

function updateImagePreview(url) {
  const box = document.getElementById("image-preview-box");
  if (!url) {
    box.innerHTML = `
      <span class="placeholder-text">
        <i class="fas fa-image" style="font-size: 1.8rem; display:block; margin-bottom:0.5rem;"></i>
        Pratinjau gambar akan muncul di sini
      </span>`;
    return;
  }
  // Path relatif (images/...) perlu prefix ../ karena halaman admin ada di subfolder
  const resolvedUrl = url.startsWith("http") ? url : `../${url}`;
  box.innerHTML = `<img src="${resolvedUrl}" alt="Preview" onerror="this.parentElement.innerHTML='<span class=\\'placeholder-text\\'>Gambar tidak ditemukan / URL salah</span>'" />`;
}

function validateProductForm() {
  let valid = true;

  function check(id, condition) {
    const field = document.getElementById(id);
    const group = field.closest(".form-group");
    if (!condition) {
      group.classList.add("invalid");
      valid = false;
    } else {
      group.classList.remove("invalid");
    }
  }

  check("p-image", document.getElementById("p-image").value.trim().length > 0);
  check("p-name", document.getElementById("p-name").value.trim().length >= 3);
  check("p-weight", document.getElementById("p-weight").value.trim().length > 0);
  check("p-price", Number(document.getElementById("p-price").value) > 0);
  check("p-stock", Number(document.getElementById("p-stock").value) >= 0);
  check("p-desc", document.getElementById("p-desc").value.trim().length >= 15);

  return valid;
}

function getFormProductData() {
  return {
    image: document.getElementById("p-image").value.trim(),
    name: document.getElementById("p-name").value.trim(),
    category: document.getElementById("p-category").value,
    weight: document.getElementById("p-weight").value.trim(),
    price: Number(document.getElementById("p-price").value),
    stock: Number(document.getElementById("p-stock").value),
    badge: document.getElementById("p-badge").value,
    rating: Number(document.getElementById("p-rating").value) || 4.5,
    description: document.getElementById("p-desc").value.trim(),
  };
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminLayout();

  const id = getQueryParam("id");
  if (id) {
    editingProductId = Number(id);
    const product = PRODUCTS.find((p) => p.id === editingProductId);
    if (product) {
      document.getElementById("page-title").textContent = "Edit Produk - Mammalia Admin";
      document.getElementById("form-heading").innerHTML = '<i class="fas fa-pen"></i> Edit Produk';
      document.getElementById("submit-btn-text").textContent = "Update Produk";
      fillFormWithProduct(product);
    }
  }

  document.getElementById("p-image").addEventListener("input", (e) => updateImagePreview(e.target.value.trim()));

  document.getElementById("product-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateProductForm()) {
      showNotification("Mohon lengkapi form dengan benar.", "error");
      return;
    }
    const data = getFormProductData();

    if (editingProductId) {
      updateProduct(editingProductId, data);
      showNotification("Produk berhasil diperbarui!", "success");
    } else {
      addProduct(data);
      showNotification("Produk baru berhasil ditambahkan!", "success");
    }

    setTimeout(() => {
      window.location.href = "products.html";
    }, 900);
  });
});

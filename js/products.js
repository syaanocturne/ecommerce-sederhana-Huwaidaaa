/**
 * products.js
 * Data katalog produk Mammalia Cookies.
 * Setiap produk memiliki: id, name, category, price (Rupiah), image, description, stock, badge
 */


const PRODUCTS_LS_KEY = "mammalia_products";

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Dark Cocoa Bites",
    category: "cookies",
    weight: "350gr",
    price: 40000,
    image: "images/chocolate-bites.jpeg",
    description:
      "Cookies cokelat lumer dengan potongan dark chocolate premium di setiap gigitan. Renyah di luar, lembut di dalam menjadi favorit sepanjang masa.",
    stock: 100,
    badge: "Best Seller",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Kyoto Matcha Bites",
    category: "cookies",
    weight: "350gr",
    price: 55000,
    image: "images/matcha-bites.jpeg",
    description:
      "Perpaduan matcha Jepang asli dengan white chocolate chips. Rasa earthy yang seimbang dengan manis lembut, cocok untuk pecinta green tea.",
    stock: 100,
    badge: "New",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Velvet Crinkles",
    category: "cookies",
    weight: "350gr",
    price: 40000,
    image: "images/red-velvet-cookies.jpeg",
    description:
      "Cookies dengan tekstur ringan dan renyah, terinspirasi dari klasiknya kue lidah kucing. Dilapisi dengan cokelat dan potongan kacang.",
    stock: 20,
    badge: "",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Signature Kastangel",
    category: "cookies",
    weight: "350gr",
    price: 55000,
    image: "images/kastangel.jpeg",
    description:
      "Kastangel klasik dengan keju edam pilihan, gurih dan renyah. Dibuat dengan resep rumahan turun-temurun.",
    stock: 100,
    badge: "Cheesy",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Classic Nastar",
    category: "pastry",
    weight: "350gr",
    price: 50000,
    image: "images/nastar.jpg",
    description:
      "Nastar dengan selai nanas asli tanpa pengawet, tekstur lumer di mulut dengan taburan keju parut di atasnya.",
    stock: 100,
    badge: "Best Seller",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Choco Chip Cookies",
    category: "cookies",
    weight: "350gr",
    price: 40000,
    image: "images/choco-chip.jpg",
    description:
      "Sebuah interpretasi klasik dari chocolate chip cookie, cocok untuk jadi teman minum teh.",
    stock: 100,
    badge: "",
    rating: 4.6,
  },
  {
    id: 7,
    name: "Palm Sugar & Cheese",
    category: "cookies",
    weight: "350gr",
    price: 40000,
    image: "images/oatmeal-raisin.jpg",
    description:
      "Perpaduan gula aren dan keju pilihan menciptakan cita rasa yang seimbang, dengan sentuhan karamel yang lembut dan gurih.",
    stock: 16,
    badge: "Cheesy",
    rating: 4.5,
  },
  {
    id: 8,
    name: "Butter Sogo Cookies",
    category: "cookies",
    weight: "350gr",
    price: 45000,
    image: "images/almond-crunch.jpg",
    description:
      "Cookies sagu dengan tekstur ringan yang lembut dan mudah lumer di mulut.",
    stock: 100,
    badge: "Cheesy",
    rating: 4.9,
  },
  {
    id: 9,
    name: "Hampers by Mammalia (Mix 3 Jar)",
    category: "giftbox",
    weight: "3 x 350gr",
    price: 150000,
    image: "images/gift-box-lebaran.jpg",
    description:
      "Paket hampers berisi 3 toples cookies pilihan, dikemas eksklusif dengan kotak elegan. Pilihan tepat untuk hadiah hari raya dan momen spesialmu..",
    stock: 100,
    badge: "Hampers",
    rating: 5.0,
  },
  {
    id: 10,
    name: "Canvas Tote Bag by Mammalia (official merch)",
    category: "giftbox",
    weight: "25gr",
    price: 45000,
    image: "images/sampler-pack.jpg",
    description:
      "Our Official Merchandise.",
    stock: 15,
    badge: "Hampers",
    rating: 4.9,
  },
];

function loadProductsFromStorage() {
  try {
    const raw = localStorage.getItem(PRODUCTS_LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Gagal membaca data produk dari localStorage:", e);
  }
  // Belum ada data tersimpan -> pakai default & simpan sebagai data awal
  try {
    localStorage.setItem(PRODUCTS_LS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  } catch (e) {
    console.error("Gagal menyimpan data produk awal:", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
}

const PRODUCTS = loadProductsFromStorage();

/** Kategori untuk keperluan filter */
const CATEGORIES = [
  { value: "all", label: "Semua Kategori" },
  { value: "cookies", label: "Cookies" },
  { value: "cheesy", label: "Cheesy" },
  { value: "giftbox", label: "Gift Box / Hampers" },
];

/** Helper format rupiah */
function formatRupiah(number) {
  return "Rp " + number.toLocaleString("id-ID");
}

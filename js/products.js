/**
 * products.js
 * Data katalog produk Mammalia Cookies.
 * Setiap produk memiliki: id, name, category, price (Rupiah), image, description, stock, badge
 */

const PRODUCTS = [
  {
    id: 1,
    name: "Chocolate Bites",
    category: "cookies",
    weight: "300gr",
    price: 35000,
    image: "images/chocolate-bites.jpeg",
    description:
      "Cookies cokelat lumer dengan potongan dark chocolate premium di setiap gigitan. Renyah di luar, lembut di dalam — favorit sepanjang masa.",
    stock: 24,
    badge: "Best Seller",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Matcha Bites",
    category: "cookies",
    weight: "300gr",
    price: 35000,
    image: "images/matcha-bites.jpeg",
    description:
      "Perpaduan matcha Jepang asli dengan white chocolate chips. Rasa earthy yang seimbang dengan manis lembut, cocok untuk pecinta green tea.",
    stock: 18,
    badge: "New",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Red Velvet Cookies",
    category: "cookies",
    weight: "300gr",
    price: 35000,
    image: "images/red-velvet-cookies.jpeg",
    description:
      "Cookies merah khas red velvet dengan cream cheese chips di dalamnya. Tampilan cantik, rasa creamy yang memanjakan lidah.",
    stock: 20,
    badge: "",
    rating: 4.7,
  },
  {
    id: 4,
    name: "Kastangel",
    category: "pastry",
    weight: "250gr",
    price: 40000,
    image: "images/kastangel.jpeg",
    description:
      "Kastangel klasik dengan keju edam pilihan, gurih dan renyah. Dibuat dengan resep rumahan turun-temurun.",
    stock: 15,
    badge: "Best Seller",
    rating: 4.9,
  },
  {
    id: 5,
    name: "Nastar Premium",
    category: "pastry",
    weight: "250gr",
    price: 42000,
    image: "images/nastar.svg",
    description:
      "Nastar dengan selai nanas asli tanpa pengawet, tekstur lumer di mulut dengan taburan keju parut di atasnya.",
    stock: 22,
    badge: "",
    rating: 4.8,
  },
  {
    id: 6,
    name: "Choco Chip Cookies",
    category: "cookies",
    weight: "300gr",
    price: 33000,
    image: "images/choco-chip.svg",
    description:
      "Cookies klasik dengan choco chip melimpah. Tekstur chewy di tengah dan crispy di pinggir, cocok menemani waktu santai.",
    stock: 30,
    badge: "",
    rating: 4.6,
  },
  {
    id: 7,
    name: "Oatmeal Raisin Cookies",
    category: "cookies",
    weight: "300gr",
    price: 32000,
    image: "images/oatmeal-raisin.svg",
    description:
      "Cookies oatmeal sehat dengan kismis manis alami. Pilihan tepat untuk camilan yang lebih ringan tanpa mengurangi kelezatan.",
    stock: 16,
    badge: "Sehat",
    rating: 4.5,
  },
  {
    id: 8,
    name: "Almond Crunch Cookies",
    category: "cookies",
    weight: "250gr",
    price: 45000,
    image: "images/almond-crunch.svg",
    description:
      "Cookies premium dengan taburan almond panggang utuh. Renyah maksimal dengan aroma kacang yang khas.",
    stock: 12,
    badge: "Premium",
    rating: 4.9,
  },
  {
    id: 9,
    name: "Lebaran Gift Box (Mix 4 Toples)",
    category: "giftbox",
    weight: "4 x 250gr",
    price: 150000,
    image: "images/gift-box-lebaran.svg",
    description:
      "Paket hampers berisi 4 toples cookies pilihan, dikemas eksklusif dengan kotak elegan. Pilihan tepat untuk hadiah Lebaran & hari raya.",
    stock: 10,
    badge: "Hampers",
    rating: 5.0,
  },
  {
    id: 10,
    name: "Cookies Sampler Pack (5 Varian)",
    category: "giftbox",
    weight: "5 x 150gr",
    price: 120000,
    image: "images/sampler-pack.svg",
    description:
      "Cicipi 5 varian rasa terbaik kami dalam satu paket: chocolate, matcha, red velvet, choco chip, dan almond crunch.",
    stock: 14,
    badge: "Hampers",
    rating: 4.9,
  },
];

/** Kategori untuk keperluan filter */
const CATEGORIES = [
  { value: "all", label: "Semua Kategori" },
  { value: "cookies", label: "Cookies" },
  { value: "pastry", label: "Pastry" },
  { value: "giftbox", label: "Gift Box / Hampers" },
];

/** Helper format rupiah */
function formatRupiah(number) {
  return "Rp " + number.toLocaleString("id-ID");
}
